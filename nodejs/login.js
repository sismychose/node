var express = require('express');
var app = express();
//var router = require('router');

app.get('/login.html',function(req,res){
	res.sendFile(__dirname + "/" + "login.html");
})

app.get('/index.html',function(req,res){
	res.sendFile(__dirname + "/" + "index.html");
})

app.get('/login',function(req,res){
	response={
		name:req.query.name,
		pwd:req.query.pwd
	};
	console.log(response);
	//res.end(JSON.stringify(response));
	//res.redirect('index.html');
	 res.render("index",{
	 	name:req.query.name,
	 	pwd:req.query.pwd
	 });
})

var server = app.listen(8081,function(){
	var host = server.address().address
	var port = server.address().port

	console.log("访问地址：http://%s:%s",host,port)
})