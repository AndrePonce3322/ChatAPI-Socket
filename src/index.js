/* eslint-disable no-undef */
'user-strict';
require('dotenv').config();

console.clear();

// Express
const express = require('express');
const app = express();
const cors = require('cors');

const corsOptions = {
  origin: [
    'https://chatwaveapp.netlify.app/',
    'https://chatwaveapp.netlify.app',
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server);

// MongoDB Mesage Module
const MessageModel = require('./models/message_eschema');
const userModel = require('./models/users_eschema');
const axios = require('axios');

// PORTS
const PORT = process.env.PORT || 3000;
const MONGO_PORT = process.env.MONGO_PORT || 27017;

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    io.emit('recibido', msg);

    const msgToJson = JSON.parse(msg);

    if (
      msgToJson._id === '' ||
      msgToJson.user.img === '' ||
      msgToJson.user.name === ''
    ) {
      return console.log(
        'error, data are not complete, make sure you send _id, img and name'
      );
    }

    // Save image
    if (
      (msgToJson.img && msgToJson.messageText) ||
      (msgToJson.img && !msgToJson.messageText)
    ) {
      const SendMsgWithImage = new MessageModel({
        messageText: msgToJson.messageText,
        user: msgToJson._id,
        img: msgToJson.img,
        createdAt: new Date(),
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
        createdAt: new Date(),
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
      createdAt: new Date(),
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

server.listen(PORT, () => {
  console.log('Socket.io corriendo por el puerto', PORT);
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

app.listen(MONGO_PORT, () => {
  console.log('database link', MONGO_PORT);
});

// Función para hacer la petición a la URL cada 22 horas para que no se duerma
const makeRequest = async () => {
  try {
    const response = await axios.get(
      'https://chatapi-socket-dev-mgdp.2.us-1.fl0.io'
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

// 10 horas (36000000 milisegundos)
setInterval(makeRequest, 36000000);
