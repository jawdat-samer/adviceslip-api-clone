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
    pages: availableResults > 0 ? availableResults / paginationOptions.take : availableResults,
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

exports.createUser = catchAsync(async (req, res, next) => {});

exports.updateUser = catchAsync(async (req, res, next) => {});

exports.deleteUser = catchAsync(async (req, res, next) => {});

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
