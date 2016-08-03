var entries = [
	{"id":1,"title":"第一篇","body":"正文","published":"7/12/2016"},
	{"id":2,"title":"第二篇","body":"正文","published":"7/13/2016"},
	{"id":3,"title":"第三篇","body":"正文","published":"7/14/2016"},
	{"id":4,"title":"第四篇","body":"正文","published":"7/15/2016"},
	{"id":5,"title":"第五篇","body":"正文","published":"7/16/2016"},
	{"id":6,"title":"第六篇","body":"正文","published":"7/17/2016"}
];

exports.getBlogEntries = function(){
	return entries;
}

exports.getBlogEntry = function(id){
	for(var i=0; i < entries.length; i++){
		if(entries[i].id == id) return entries[i];
 	}
}