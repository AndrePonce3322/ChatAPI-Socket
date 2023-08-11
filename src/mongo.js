/* eslint-disable no-undef */
require('dotenv').config();

const mongoose = require('mongoose');
const connection = process.env.MONGODB_URI;

// MongoDB connection
mongoose
  .connect(connection)
  .then(() => {
    console.log('Conectado a la base de datos');
  })
  .catch((err) => {
    console.log('Ha ocurrido un error');
    console.log(err);
    mongoose.connection.close();
  });

// eslint-disable-next-line no-undef
process.on('uncaughtException', () => {
  mongoose.disconnect();
});

module.exports = mongoose;
