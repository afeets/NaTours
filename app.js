const express = require('express');
const morgan = require('morgan');
const keys = require('./config/dev');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const qs = require('qs');

// MIDDLEWARE /////////////////////////////////////////
app.set('query parser', (str) => qs.parse(str));

if (keys.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
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
