const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const hpp = require('hpp');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const adviceRouter = require('./routes/adviceRoutes');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limitter = rateLimit({
  limit: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP!',
  legacyHeaders: false,
});

app.use(limitter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));
app.use(cookieParser());

app.use(hpp());

app.use(xss());

app.use(compression());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/advices', adviceRouter);

app.all('*', (req, res, next) => {
  return next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
