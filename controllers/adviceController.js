const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const prisma = new PrismaClient();

exports.createAdvice = catchAsync(async (req, res, next) => {
  const data = req.validatedData;

  const advice = await prisma.advice.create({
    data: {
      content: data.content,
    },
  });

  await prisma.adviceCounter.update({
    where: {
      id: 1,
    },
    data: {
      counter: advice.id,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      advice: advice,
    },
  });
});

exports.getAdvice = catchAsync(async (req, res, next) => {
  const data = req.validatedData;

  const advice = await prisma.advice.findUnique({
    where: {
      id: data.adviceID,
    },
  });

  if (!advice) return next(new AppError('Advice not found!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      advice: advice,
    },
  });
});

exports.getRandomAdvice = catchAsync(async (req, res, next) => {
  const adviceCounter = await prisma.adviceCounter.findFirst({
    where: {
      id: 1,
    },
  });

  if (!adviceCounter) {
    return next(new AppError('There is no advices!', 400));
  }

  let advice;
  while (!advice) {
    const randomNumber = Math.trunc(Math.random() * adviceCounter.counter) + 1;
    advice = await prisma.advice.findFirst({
      where: {
        id: randomNumber,
      },
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      advice: advice,
    },
  });
});
