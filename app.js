var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tradeRouter = require('./routes/trade');
var noticeRouter = require('./routes/notice');


var app = express();

const {sequelize} = require('./models');
//const bodyParser = require('body-parser');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// /img 파일 경로 지정
app.use('/img', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    key: 'sid',
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
    }
}));

//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({extended:false}));

//db연결
sequelize.sync({ force: false })
    .then(() => {
      console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
      console.error(err);
    });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/trade', tradeRouter);
app.use('/notice', noticeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
