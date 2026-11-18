const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const keys = require('./config/dev');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const qs = require('qs');
const { whitelist } = require('validator');

// GLOBAL MIDDLEWARE /////////////////////////////////////////
app.set('query parser', (str) => qs.parse(str));

// set security HTTP Headers
app.use(helmet());

if (keys.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit number of requests from same API in time window (eg 1hour)
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour',
});

app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS, converting html tags into clean code
app.use(xss());

// prevent parameter polution, cleaning up query string, whitelisting some properties
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// serve static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello',
    app: 'NaTours',
  });
});

/*
app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTourById);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);
*/

// ROUTES /////////////////////////////////////////////////////
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// handle non defined URLs with NOT FOUND
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Express Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
