var crypto = require('crypto');
var User = require('../node_modules/user.js');
var Post = require('../node_modules/post.js');
var Pager = require('../node_modules/pager.js');
/*
 * GET home page.
 */
 
exports.index = function(req, res){
  console.log('index方法执行，进入index页面');
  var pager = "";
  
  var page = req.query.page?req.query.page:1;
  var pagesize = 9;
  Post.getUserTotal('', function(err, count){
    if (err) {
      return res.redirect('/');
    }
    //console.log(count);
    Post.getUserPage('',page,pagesize, function(err, posts) {
        if (err) {
          return res.redirect('/');
        }

        Pager.show_page(req,page,pagesize,count,'2','',function(showpage){
            console.dir(showpage);//return;
            pager = showpage;
        });
        //console.dir(posts);//return;
        res.render('index', { title: 'microblog',posts: posts,pager:pager,layout:'layout',nav:'index'});
      });
  });
  
};
exports.ccapimg = function(req, res){
  var ccap = require('ccap')();//Instantiated ccap class
  //if(request.url == '/favicon.ico')return response.end('');//Intercept request favicon.ico
  var ary = ccap.get();

  var txt = ary[0].toLocaleString().toLowerCase();

  var buf = ary[1];
  req.session.ccapimg = txt;
  console.log(req.session.ccapimg);
  console.log(txt);
  res.end(buf);
  
 
};