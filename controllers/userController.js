const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const prisma = new PrismaClient();

exports.getAllUser = catchAsync(async (req, res, next) => {
  const data = req.validatedData;

  const filterOptions = {
    isActive: true,
  };

  if (!(data.active === undefined)) filterOptions.isActive = data.active;

  const paginationOptions = {
    take: 10,
    skip: 0,
  };

  if (data.show && data.show > 0) paginationOptions.take = data.show;
  if (data.page && data.page > 0) paginationOptions.skip = (data.page - 1) * paginationOptions.take;

  const availableResults = await prisma.user.count({
    where: {
      isActive: filterOptions.isActive,
    },
  });

  const users = await prisma.user.findMany({
    where: {
      isActive: filterOptions.isActive,
    },
    select: {
      id: true,
      name: true,
      email: true,
      photo: true,
      role: true,
    },
    take: paginationOptions.take,
    skip: paginationOptions.skip,
  });

  res.status(200).json({
    status: 'success',
    results: users.length,
    pages: availableResults > 0 ? Math.ceil(availableResults / paginationOptions.take) : availableResults,
    data: {
      users: users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const data = req.validatedData;

  const user = await prisma.user.findUnique({
    where: {
      id: data.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      photo: true,
      role: true,
    },
  });

  if (!user) {
    return next(new AppError('User not found!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const data = req.validatedData;

  const checkEmail = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (checkEmail) {
    return next(new AppError('Email already exists!', 401));
  }

  data.password = await bcrypt.hash(data.password, 12);

  const roles = ['admin', 'author'];

  if (!roles.includes(data.role)) {
    return next(new AppError('Invalid role for this user!', 401));
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      photo: true,
      role: true,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const data = req.validatedData;

  const checkUser = await prisma.user.findUnique({
    where: {
      id: data.userId,
    },
  });

  if (!checkUser) {
    return next(new AppError('User not found!', 404));
  }

  if (!data.name && !data.email && !data.password && !data.role) {
    return next(new AppError('Nothing to update!', 400));
  }

  const dataToUpdate = {};

  if (data.name) dataToUpdate.name = data.name;
  if (data.email) {
    const checkEmail = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (checkEmail) {
      return next(new AppError('Email already exists!', 401));
    }

    dataToUpdate.email = data.email;
  }
  if (data.password) dataToUpdate.password = await bcrypt.hash(data.password, 12);
  if (data.role) {
    const roles = ['admin', 'author'];

    if (!roles.includes(data.role)) {
      return next(new AppError('Invalid role for this user!', 401));
    }

    dataToUpdate.role = data.role;
  }
  if (!(data.active === undefined)) dataToUpdate.isActive = data.active;

  console.log(dataToUpdate);

  const user = await prisma.user.update({
    where: {
      id: data.userId,
    },
    data: dataToUpdate,
    select: {
      id: true,
      name: true,
      email: true,
      photo: true,
      role: true,
      isActive: true,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const data = req.validatedData;

  const checkUser = await prisma.user.findUnique({
    where: {
      id: data.userId,
    },
  });

  if (!checkUser) {
    return next(new AppError('User not found!', 404));
  }

  await prisma.user.delete({
    where: {
      id: data.userId,
    },
  });

  res.status(204).json({
    status: 'success',
    message: 'User has been deleted!',
  });
});

exports.getMe = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  const data = req.validatedData;

  if (!data.name && !data.email) {
    return next(new AppError('Nothing to update!', 400));
  }

  const dataToUpdate = {};

  if (data.name) dataToUpdate.name = data.name;
  if (data.email) dataToUpdate.email = data.email;

  const user = await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: dataToUpdate,
    select: {
      id: true,
      name: true,
      email: true,
      photo: true,
      role: true,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const data = req.validatedData;

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  const checkPassword = await bcrypt.compare(data.password, user.password);

  if (!checkPassword) {
    return next(new AppError('Wrong password!', 401));
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isActive: false,
    },
  });

  res.status(204).json({
    status: 'success',
    message: 'Account has been deleted!',
  });
});
