const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
const keys = require('./config/dev');

const DB = keys.DB_CONN_STRING.replace('<PASSWORD>',keys.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB Connection Successful'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}....`);
});
