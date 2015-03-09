/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , ejs = require('ejs')
  , SessionStore = require("session-mongoose")(express);

var store = new SessionStore({
	url: "mongodb://localhost/session",
	interval: 120000
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.urlencoded());
app.use(express.methodOverride());


app.use(express.cookieParser());
app.use(express.cookieSession({secret : 'highsea90.com'}));
app.use(express.session({
	secret : 'highsea90.com',
	store: store,
	cookie: { maxAge: 900000 }
}));
app.use(function(req, res, next){
	res.locals.user = req.session.user;
	next();
});


app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        result: err.resultlogin,
	    title: err.message,
        error: {},
        //textStatus : err.navText
    });
});
/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('找不到这个页面');
    err.status = 404;
    err.resultlogin = 0;//未登录
    next(err);
});
// development only
if ('development' == app.get('env')) {
  	//app.use(express.errorHandler());
	app.use(function(err, req, res, next) {
	    res.render('error', {
	        message: err.message,
	        title: err.message,
	        result: err.resultlogin,
	        error: err
	    });
	});
}

app.get('/', routes.index);
app.get('/users', user.list);
// hi-blog 项目路由
app.get('/login', routes.login);
app.get('/logout', routes.logout);
app.post('/home', routes.homepost);
app.get('/home', routes.homeget);
app.post('/adduser',routes.adduser);
app.get('/adduserget',routes.adduserget);
app.get('/register', routes.register);
app.get('/getuser', routes.getuser);
app.get('/up1user', routes.up1user);
app.get('/userCount', routes.userCount);
app.get('/remove1user', routes.remove1user);
app.get('/oneuser', routes.oneuser);





http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
