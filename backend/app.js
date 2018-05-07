var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require("express-session");
const passport = require("passport");


var users = require('./routes/users');

var app = express();
var io = app.io = require('socket.io')();

var APIKey = require('./config')

var googleTranslate = require("google-translate")(
  APIKey.keys.googleTranslate
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret:
      "\x02\xf3\xf7r\t\x9f\xee\xbbu\xb1\xe1\x90\xfe'\xab\xa6L6\xdd\x8d[\xccO\xfe",
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

var clients = [];

io.on("connection", socket => {
  socket.on("storeClientInfo", data => {
  
      var clientInfo = new Object();
      clientInfo.username = data.username;
      clientInfo.userId = data.userId;
      clientInfo.connectionId = socket.id;
      clientInfo.language = data.language;
      clients.push(clientInfo);

    console.log('Clients Being Stored:',clients);
  });

  socket.on("chat", data => {
    console.log('Chat Data', data)
   
      let user = clients.find(u => u.userId === data.receiver_id);
      console.log('User Receiving Message', user)
      googleTranslate.translate(data.messages, user.language, function(
        err,
        translation
      ) {

        socket.emit("chat", {
          threadID: data.threadID,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          username: data.username,
          translatedMessage: translation.translatedText,
          originalMessage: translation.originalText
        });

        // socket.to(user.connectionId).emit("chat", {
        //   threadID: data.threadID,
        //   sender_id: data.sender_id,
        //   receiver_id: data.receiver_id,
        //   username: data.username,
        //   translatedMessage: translation.translatedText,
        //   originalMessage: translation.originalText
        // });

      });
  });

  socket.on("disconnect", data => {
    for (var i = 0, len = clients.length; i < len; ++i) {
      var c = clients[i];

      if (c.connectionId == socket.id) {
        clients.splice(i, 1);
        console.log('running?')
        break;
      }
    }
  });
});


app.use('/', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
