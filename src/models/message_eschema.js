const { model, Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const esquema = new Schema({
  messageText: { type: String },
  img: { type: String },
  video: { type: String },
  createdAt: { type: Date, default: new Date(), required: true },
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
