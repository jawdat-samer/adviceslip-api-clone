const { promisify } = require('util');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const prisma = new PrismaClient();

const signNewToken = (res, id) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
  });

  return token;
};

const createNewResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  return [resetToken, hashedResetToken];
};

exports.signup = catchAsync(async (req, res, next) => {
  const data = req.validatedData;

  const checkEmail = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (checkEmail) return next(new AppError('Email already exists!', 400));

  data.password = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  });

  const token = signNewToken(res, user.id);

  res.status(201).json({
    status: 'success',
    token: token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const data = req.validatedData;

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user || (user && !user.isActive)) {
    return next(new AppError('Incorrect Email or password', 401));
  }

  const checkPassword = await bcrypt.compare(data.password, user.password);

  if (!checkPassword) {
    return next(new AppError('Incorrect Email or password', 401));
  }

  const token = signNewToken(res, user.id);

  res.status(200).json({
    status: 'success',
    token: token,
  });
});

exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 10 * 1000),
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Successfuly logged out',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies && req.cookies.jwt) {
  //   token = req.cookies.jwt;
  // }

  if (!token) {
    return next(new AppError('Login to get access!', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      photo: true,
      role: true,
      isActive: true,
      passwordUpdatedAt: true,
    },
  });

  if (!user.isActive) {
    return next(new AppError('Account is no longer exists!', 401));
  }

  const changedPasswordTimestamp = Number.parseInt(user.passwordUpdatedAt / 1000, 10);

  if (decoded.iat < changedPasswordTimestamp) {
    return next(new AppError('Password has been changed recently', 401));
  }

  delete user.passwordUpdatedAt;
  delete user.isActive;

  req.user = user;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`You don't have permission to perform this action!`, 403));
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const data = req.validatedData;

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) return next(new AppError('There is no account with this email', 404));

  const [resetToken, hashedResetToken] = createNewResetToken();

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordResetToken: hashedResetToken,
      passwordResetExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `
    <p>
      Forgot your password? Submit a PATCH request with your new password and
      passwordConfirm to <a href="${resetUrl}">Reset link</a>.
    </p>
    <p>
      If you didn't forget your password, please ignore this email!
    </p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Valid for 15 min)',
      message: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Reset token sent to email',
    });
  } catch (err) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordResetToken: null,
        passwordResetExpiresAt: null,
      },
    });

    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const data = req.validatedData;

  data.resetToken = crypto.createHash('sha256').update(data.resetToken).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: data.resetToken,
    },
  });

  if (!user) return next(new AppError('Incorrect reset token URL! Try again later with new reset token.', 400));

  const resetTokenTimestamp = Number.parseInt(user.passwordResetExpiresAt, 10);

  if (Date.now() > resetTokenTimestamp) {
    return next(new AppError('Reset token expired! Try again later with new reset token.', 400));
  }

  data.password = await bcrypt.hash(data.password, 12);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: data.password,
      passwordUpdatedAt: new Date(Date.now()),
      passwordResetToken: null,
      passwordResetExpiresAt: null,
    },
  });

  const token = signNewToken(res, user.id);

  res.status(200).json({
    status: 'success',
    token: token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const data = req.validatedData;

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  const confirmOldPassword = await bcrypt.compare(data.oldPassword, user.password);

  if (!confirmOldPassword) {
    return next(AppError('Wrong old password!', 401));
  }

  data.password = await bcrypt.hash(data.password, 12);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: data.password,
      passwordUpdatedAt: new Date(Date.now()),
    },
  });

  const token = signNewToken(res, user.id);

  res.status(200).json({
    status: 'success',
    token: token,
  });
});
