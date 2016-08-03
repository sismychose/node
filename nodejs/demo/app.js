/* // 静态网页
var express = require('express');
var app = express();

app.set('port',process.env.PORT || 3000);
// app.set('views',path.join(__dirname,'views'));

// app.set('view engine','jade');


// app.use(express.logger('dev'));
// app.use(express.bodyParser());
// app.use(express.methodOverride());
// app.use(app.router);
app.use(express.favicon());
// app.use(express.static(path.join(__dirname,'public')));

app.listen(app.get('port'));

app.get('/',function(req,res){
	res.send('Hello World');
});

app.get('/',function(req,res){
	var body = 'Hello World';
	res.setHeader('Content-Type','text/plain');
	res.setHeader('Content-Length',body.length);
	res.end(body);
});

app.get('/api',function(request,response){
	response.send({name:"张三",age:40});
});
app.listen(3000);*/


/* // 静态网页
var express = require('express');
var app = express();

app.get('/',function(req,res){
	res.sendfile('./views/index.html');
});

app.get('/about',function(req,res){
	res.sendfile('./views/about.html');
});

app.get('/article',function(req,res){
	res.sendfile('./views/article.html');
});

app.listen(3000);*/

/*var express = require('express');
var app = express();

var hbs = require('hbs');

// 指定文件后缀名html
app.set('View engine','html');

// 运行hbs模板
app.engine('html',hbs.__express);

app.get('/',function(req,res){
	res.render('index');
});

app.get('/about',function (req,res) {
	res.render('about');
});

app.get('/article',function(req,res){
	res.render('article');
});

app.listen(3000);*/

var express = require('express');
var app = express();

var hbs = require('hbs');

var blogEngine = require('./blog');

app.set('view engine','html');
app.engine('html',hbs.__express);
app.use(express.bodyParser());

app.get('/',function(req,res){
	res.render('index',{title:"最近文章",entries:blogEngine.getBlogEntries()});
});

app.get('/about',function(req,res){
	res.render('about',{title:"自我介绍"});
});

app.get('/article/:id',function(req,res){
	var entry = blogEngine.getBlogEntry(req.params.id);
	res.render('article',{title:entry.title,blog:entry});
});

app.listen(3000);