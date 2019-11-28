var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// let busboy = require('connect-busboy');
// app.use(busboy())

var login = require('./routes/login');
var BasicManagement = require('./routes/BasicManagement');//基础管理
var Equipment = require('./routes/Equipment');//设备
var ReportData = require('./routes/ReportData');//报表数据
var Other = require('./routes/Other');//其它
var Ownermanagement = require('./routes/Ownermanagement');//（业主）后台管理
var Generalization = require('./routes/Generalization');//概括
var OwnerGeneralization = require('./routes/OwnerGeneralization');//概括
var MonitoringStation = require('./routes/MonitoringStation');//控制台
var EquipmentAbnormality = require('./routes/EquipmentAbnormality');//设备异常

var config = require('./config');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cookieParser('sessiontest'));
<!-- session配置 -->
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'sessiontest',
  rolling: true,
  cookie: {
    maxAge: 1 * 60 * 60 * 1000 // default session expiration is set to 12 hour
  },
}));

// app.use(function(req, res, next){
//   // console.log("额而发 "+JSON.stringify(req.session));
// res.locals.session = req.session;
// next();
// });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', login);
app.use('/', BasicManagement);
app.use('/', Equipment);
app.use('/', ReportData);
app.use('/', Other);
app.use('/', Ownermanagement);
app.use('/', Generalization);
app.use('/', OwnerGeneralization);
app.use('/', MonitoringStation);
app.use('/', EquipmentAbnormality);


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
