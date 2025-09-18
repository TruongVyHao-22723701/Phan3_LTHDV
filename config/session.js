// config/session.js
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

module.exports = (app) => {
  app.use(
    session({
      name: 'sid', // tên cookie
      secret: process.env.SESSION_SECRET || 'secret_key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // đổi thành true nếu chạy HTTPS
        maxAge: 1000 * 60 * 60 // 1 giờ
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
      })
    })
  );
};
