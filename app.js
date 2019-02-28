const createError = require('http-errors');
const flash = require('connect-flash');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();

// notifications handle
// const { notifications } = require('./assets');

const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${process.env.MONGO_URI}`);
  })
  .catch((error) => {
    console.log(error);
  });

// mongodb connect
// const dbName = 'YOUR-DATABASE-NAME';
// (async () => {
//   try{
//     await mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true });
//     console.log(`Conected to ${dbName}`);
//   }catch{
//     err => {
//       console.error(`Error conecting to ${dbName}. `, err);
//     }
//   }
// })();

const app = express();

// app title
app.locals.title = 'travelBID';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

// middlewares
app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// app.use(flash());
app.use((req, res, next) => {
  // assign current user to all middlewares
  res.locals.currentUser = req.session.currentUser;
  next();
});
// app.use(notifications);
app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
