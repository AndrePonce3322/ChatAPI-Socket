const { model, Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const currentDateUTC = new Date();

// Convertir a la zona horaria de Ciudad de México
const currentDateMexico = new Date(
  currentDateUTC.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })
);

const esquema = new Schema({
  messageText: { type: String },
  img: { type: String },
  video: { type: String},
  createdAt: { type: Date, default: currentDateMexico, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

esquema.plugin(uniqueValidator);

esquema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
  },
});

const MessageModel = model('Message', esquema);

module.exports = MessageModel;
