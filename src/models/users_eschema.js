const { model, Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const esquema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  img: { type: String, required: true },
  CreatedAt: { type: Date, default: new Date(), required: true },
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
