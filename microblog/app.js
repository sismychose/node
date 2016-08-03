
/**
 * Module dependencies.
 */

var express = require('express')
        , routes = require('./routes')
        , user = require('./routes/user')
        , http = require('http')
        , path = require('path');
var partials = require('express-partials');//使用模板
var settings = require('./settings');
var MongoStore = require('connect-mongo')(express);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());//使用模板
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({
    secret: settings.cookieSecret,
    store: new MongoStore({
        db: settings.db
    })
}));
//app.dynamicHelpers
app.use(function(req, res, next) {
    //res.locals.title = config['title']
    res.locals.csrf = req.session ? req.session._csrf : '';
    res.locals.req = req;
    res.locals.session = req.session;
    res.locals.user = req.session.user;
    next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/users', user.list);
app.all('/reg', user.reg);
app.all('/regsuccess', user.regsuccess);
app.all('/regexist', user.regexist);
app.all('/login', user.login);
app.all('/loginsuccess', user.loginsuccess);
app.all('/loginerror', user.loginerror);
app.all('/logout', user.logout);
app.all('/logoutsuccess', user.logoutsuccess);
app.all('/post', user.post);
app.all('/loginpost', user.loginpost);
app.all('/u/:user', user.u);
app.all('/ccapimg/:randnumber', routes.ccapimg);
app.all('/checkccapimg', user.checkccapimg);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
