var express = require('express');
var http = require('http');
var path = require('path');
var reload = require('reload');
var bodyParser = require('body-parser');
var logger = require('morgan');
var watch = require('watch');
var sequelize = require('sequelize');
var PrettyError = require('pretty-error');
var cookieParser = require('cookie-parser');
var cookieEncrypter = require('cookie-encrypter');
var models = require("./server/models/");
var session = require('express-session');
var passport = require('passport');
var consolidate = require('consolidate');
var cookieSecretKey = process.env.COOKIE_SECRET_KEY;
var sessionSecretKey = process.env.SESSION_SECRET_KEY;
var app = express();
var BUILD_DIR = path.resolve(__dirname, './client/public/build');
var APP_DIR = path.resolve(__dirname, './client/app');
var config = require('./server/config/config.js');

// Initialize pretty-error
var pe = new PrettyError();
pe.start();

// Set port for heroku deployment
app.set('port', config.port);
app.use(logger('dev'));


// Support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));


// Service static assets
app.use(express.static(path.join(__dirname, './client/public/')));
app.use(express.static(path.join(__dirname, './client/public/build/')));

// passport & cookie encryption config
require('./server/config/passport')(app);
app.use(cookieParser(cookieSecretKey));
app.use(cookieEncrypter(cookieSecretKey));
app.use(session({
  secret: sessionSecretKey,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Set swig as the template engine
app.engine('template.html', consolidate[config.templateEngine]);

// Set views path and view engine
app.set('view engine', 'template.html');

// Index Routes
require('./routes/index.js')(app);

// Sync models THEN start server
models.sequelize.sync({
  force: process.env.DB_FORCE === 'true'
}).then(function () {

  var server = http.createServer(app);
  server.listen(app.get('port'), function () {
    console.log('App is listening on port ' + config.port + '! Visit localhost:' + config.port + ' in your browser.');
  });

  // Reload code here
  var reloadServer = reload(server, app);

  watch.watchTree(__dirname + "/client", function (f, curr, prev) {
    // Fire server-side reload event
    reloadServer.reload();
  });

});
