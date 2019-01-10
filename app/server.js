const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const loginRouter = require('./routes/login');
const employeeRouter = require('./routes/employees');
const path = require('path');
const cors = require('cors');
const authorized = require('./auth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.set('view engine', 'ejs');

app.use('/login', loginRouter);
app.use('/employees', employeeRouter);

app.get('/checkToken', authorized, (req, res) => {
	res.sendStatus(200);
})

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

app.listen(8080, () => {
	console.log(`Server listening on port 8080`);
});

module.exports = app;
