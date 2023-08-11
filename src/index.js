/* eslint-disable no-undef */
'user-strict';
require('dotenv').config();

console.clear();

console.log(process.env.MONGODB_URI ?? 3000);

// Express
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server);

// MongoDB Mesage Module
const MessageModel = require('./models/message_eschema');
const userModel = require('./models/users_eschema');

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    io.emit('recibido', msg);

    const msgToJson = JSON.parse(msg);

    // Save image
    if (
      (msgToJson.img && msgToJson.messageText) ||
      (msgToJson.img && !msgToJson.messageText)
    ) {
      const SendMsgWithImage = new MessageModel({
        messageText: msgToJson.messageText,
        user: msgToJson._id,
        img: msgToJson.img,
        createdAt: new Date().toLocaleString('es', { timeZoneName: 'short' }),
      });

      // Save message and save on user _id
      return SendMsgWithImage.save().then((message) => {
        userModel.findById(msgToJson._id).then((user) => {
          user.msgs.push(message._id);
          user.save().then((result) => {
            console.log(result);
          });
        });
      });
    }

    // Save video
    if (
      (msgToJson.video && msgToJson.messageText) ||
      (msgToJson.video && !msgToJson.messageText)
    ) {
      const SendVideoMSG = new MessageModel({
        messageText: msgToJson.messageText,
        user: msgToJson._id,
        video: msgToJson.video,
        createdAt: new Date().toLocaleString('es', { timeZoneName: 'short' }),
      });

      // Save message and save on user _id
      return SendVideoMSG.save().then((message) => {
        userModel.findById(msgToJson._id).then((user) => {
          user.msgs.push(message._id);
          user.save().then((result) => {
            console.log(result);
          });
        });
      });
    }

    const SendMsg = new MessageModel({
      messageText: msgToJson.messageText,
      user: msgToJson._id,
      createdAt: new Date().toLocaleString('es', { timeZoneName: 'short' }),
    });

    // Save message and save on user _id
    SendMsg.save().then((message) => {
      userModel.findById(msgToJson._id).then((user) => {
        user.msgs.push(message._id);
        user.save().then((result) => {
          console.log(result);
        });
      });
    });
  });

  socket.on('disconnect', () => {
    io.emit('user disconnected');
    console.log('Un usuario se ha desconectado');
  });
});

const socketPORT = process.env.PORT ?? 3000;

server.listen(socketPORT, () => {
  console.log('Socket.io corriendo por el puerto', socketPORT);
});

// MongoDB database
require('./mongo');

app.post('/', async (req, res) => {
  const { email, img, name } = req.body;

  if (!email || !img || !name) {
    return res.status(400).json({
      error:
        'error, data are not complete, make sure you send email, img and name',
    });
  }

  const searchUser = await userModel.findOne({ email: email });

  if (searchUser) {
    console.log('user already exists');
    console.log(searchUser);
    return res.json(searchUser);
  }

  console.log(req.body);

  const newUser = new userModel({
    name: name,
    email: email,
    img: img,
  });

  newUser.save().then((result) => {
    res.json(result);
    console.log(result);
  });
});

app.get('/', async (req, res) => {
  const mesagges = await MessageModel.find({}).populate('user', {
    CreatedAt: 0,
    msgs: 0,
    _id: 0,
  });

  res.json({ mesagges });
});

app.get('/users', async (req, res) => {
  const users = await userModel.find({}).populate('msgs', {
    messageText: 1,
    createdAt: 1,
    _id: 0,
  });

  res.json(users);
});

const MongoPORT = process.env.MONGO_PORT ?? 4000;

app.listen(MongoPORT, () => {
  console.log('database link', MongoPORT);
});
