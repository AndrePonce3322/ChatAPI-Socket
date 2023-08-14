/* eslint-disable no-undef */
require('dotenv').config();

const mongoose = require('mongoose');
const connection = "mongodb+srv://andre:andreponce123@chatrealtimedatabase.6czr7ud.mongodb.net/database?retryWrites=true&w=majority";

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
