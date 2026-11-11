const mongoose = require('mongoose');

const keys = require('./config/dev');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

// dotenv.config({ path: './config.env' });

const DB = keys.DB_CONN_STRING.replace('<PASSWORD>', keys.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB Connection Successful'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}....`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down');
  console.log(err.name, err.message);
  // give server time to close pending tasks
  server.close(() => {
    process.exit(1);
  });
});
