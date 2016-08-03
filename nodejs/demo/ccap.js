var http = require('http');
var ccap = require('ccap')();

http.createServer(function (request,response){
	if(request.url == '/favicon.ico') return response.end('');
	var ary = ccap.get();
	var txt = ary[0];
	var buf = ary[1];
	response.end(buf);
	console.log(txt);
}).listen(8124);

console.log('server running at http://127.0.0.1:8124/');