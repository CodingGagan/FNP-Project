var createError = require('http-errors');
var express = require('express');
// const mysql = require("./connection").conn
// var mysql = require("mysql")
var cors = require('cors');
var fileUpload = require("express-fileupload")
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var produtsRouter = require('./routes/products');
var supportRouter = require('./routes/support');
var settingRouter = require('./routes/setting');
var vendorRouter = require('./routes/vendor');
var roleRouter = require("./routes/role.js")
var cityRouter =  require("./routes/city");


 var app = express();
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database: "express"
// });
// connection.connect((err,res) => {
//   if(err){
//     console.log("error in database")
//   }
//   console.log("mysql connected successfully")
// })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ limit: '50mb',extended: false, parameterLimit:50000,limit:1024*1024*20, }));



app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());

// This line will make default import of attachment from public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', produtsRouter);
app.use('/support',supportRouter);
app.use('/setting', settingRouter);
app.use('/vendor',vendorRouter);
app.use("/rolemanagement", roleRouter);
app.use('/citymanagement',cityRouter)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// app.get("/getData",(req,res) =>{
//   res.send("hello")
// })



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.set('port', (process.env.PORT || 7600));
app.listen(app.get('port'), function() {
    console.log('Server started on port '+app.get('port'));
});



module.exports = app;