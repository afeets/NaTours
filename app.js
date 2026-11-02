const express = require('express');
const morgan = require('morgan');

const app = express();

const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const keys = require('./config/dev.js');

// MIDDLEWARE /////////////////////////////////////////
app.use(morgan('dev'));
app.use(express.json());

// applies to all route requests
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
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

module.exports = app;
