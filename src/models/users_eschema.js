const { model, Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const currentDateUTC = new Date();

// Convertir a la zona horaria de Ciudad de México
const currentDateMexico = new Date(
  currentDateUTC.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })
);

const esquema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  img: { type: String, required: true },
  CreatedAt: { type: Date, default: currentDateMexico, required: true },
  msgs: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
});

esquema.plugin(uniqueValidator);

const userModel = model('User', esquema);

esquema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
  },
});

module.exports = userModel;
