var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport=require('passport');
const nodemailer = require('nodemailer');
const methodOverride=require('method-override');

const session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mainRouter = require('./routes/main');
var registerRouter = require('./routes/register');
var registerCheckRouter = require('./routes/register_check');
var registerChangeRouter = require('./routes/register_change');
var withdrawalRouter = require('./routes/withdrawal');
var loginRouter=require('./routes/login');
var logoutRouter=require('./routes/logout');
var politicianUserRouter=require('./routes/politicianUser');
var searchRouter=require('./routes/searchPolitician');
var namesearchRouter=require('./routes/namesearchPolitician');
var matchingSurveyRouter=require('./routes/matching_survey');
var matchingServiceRouter=require('./routes/matching_service');
//여기까지 사용자 라우터

var adminRouter=require('./routes/admin');
var adminMemberRouter=require('./routes/adminMember');
var adminPoliticianRouter=require('./routes/adminPolitician');
var adminMemberGradeRouter=require('./routes/adminMemberGrade');
var adminPoliticianGradeRouter=require('./routes/adminPoliticianGrade');
var adminBlackMemberRouter=require('./routes/adminBlackMember');
//여기까지 어드민 라우터

var flash = require('flash');
var passportConfig=require('./passport');
var app = express();

passportConfig(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({ secret: '12345678', resave: true, saveUninitialized: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/main', mainRouter);
app.use('/register', registerRouter);
app.use('/register_check', registerCheckRouter);
app.use('/register_change', registerChangeRouter);
app.use('/withdrawal', withdrawalRouter);
app.use('/login',loginRouter);
app.use('/logout',logoutRouter);
app.use('/politician',politicianUserRouter);
app.use('/search',searchRouter);
app.use('/namesearchPolitician',namesearchRouter);
app.use('/matching_survey',matchingSurveyRouter);
app.use('/matching_service',matchingServiceRouter);
//여기까지 사용자 use

app.use('/admin',adminRouter);
app.use('/admin/member',adminMemberRouter);
app.use('/admin/politician',adminPoliticianRouter);
app.use('/admin/member_grade',adminMemberGradeRouter);
//app.use('/admin/legislation',adminLegislationRouter);
app.use('/admin/politician_grade',adminPoliticianGradeRouter);
app.use('/admin/adminBlackMember',adminBlackMemberRouter);
//여기까지 어드민 라우터


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
