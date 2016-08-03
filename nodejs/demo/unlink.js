var fs = require('fs');
fs.unlink('123.js',function(err){
	if(err) throw err;
	console.log('successfully deleted myModule.js');
});