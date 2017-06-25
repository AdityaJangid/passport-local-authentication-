/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose/');
var  rrouter  = express.Router();

mongoose.connect('mongodb://localhost:27017/MyDatabase');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log("Connection with database succeeded.");
});

console.log("123");

var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session()); 
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var Schema = mongoose.Schema;


var UserDetail = new Schema({
    username: String,
    password: String,
	email: String,
	birthday: String,
}, {collection: 'userInfo'});

var UserDetails = mongoose.model('userInfo',UserDetail);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});



passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log("username=", username); 
		console.log("password=", password); 
		process.nextTick(function () {
			UserDetails.findOne({'username':username},
				function(err, user) {
					if (err) { return done(err); }
					if (!user) { return done(null, false); }
					if (user.password != password) { return done(null, false); }
					return done(null, user);
				}
			);
		});
	}
));








app.post('/signUp', function(req,res){
var user  = new UserDetails(); 
	user.username = req.body.username; 
	user.password    = req.body.password; 
	user.email    = req.body.email; 
	user.birthday    = req.body.birthday; 
	user.save(function(err){
		if(err) {
			 response = {"error" : true,"message" : "Error adding data"};
		}
		else {
			 response = {"error" : false,"message" : "Data added"};
		} res.json(response);
	});

});



app.get('/auth', function(req, res, next) {
  res.sendfile('views/login.html');
});


app.get('/loginFailure' , function(req, res, next){
	/* res.send('Failure to authenticate'); */
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({"status": "Failure"}));

});

app.get('/loginSuccess' , function(req, res, next){
	/* res.send('Successfully authenticated'); */
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({"status": "Success"}));
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure'
  }));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

