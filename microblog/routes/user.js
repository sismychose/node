var crypto = require('crypto');
var User = require('../node_modules/user.js');
var Post = require('../node_modules/post.js');
var Pager = require('../node_modules/pager.js');
/*
 * GET users listing.
 */

exports.list = function(req, res) {
    res.send("respond with a resource");
};

exports.reg = function(req, res) {
    //console.dir(req.route);
    if (req.route.method == 'get') {
        res.render('reg', {title: 'Express', layout: 'layout',nav:'reg'});
    }
    else if (req.route.method == 'post') {
        //檢驗用戶兩次輸入的口令是否一致
        if (req.body['password-repeat'] != req.body['password']) {
            return res.redirect('/reg');
        }
        //验证码
        if (req.body['ccapimg'] != req.session.ccapimg) {
            return res.redirect('/reg');
        }
        //生成口令的散列值
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');

        var newUser = new User({
            name: req.body.username,
            password: password,
        });

        //檢查用戶名是否已經存在
        User.get(newUser.name, function(err, user) {
            if (user)
                err = 'Username already exists.';
            if (err) {
                return res.redirect('/regexist');
            }
            //如果不存在則新增用戶
            newUser.save(function(err) {
                if (err) {
                    return res.redirect('/reg');
                }
                req.session.user = newUser;
                res.redirect('/regsuccess');
            });
        });
    }
}
exports.regsuccess = function(req, res) {
    res.render('message', {title: '注册成功', url: '/', layout: 'layout',nav:'reg'});
}
exports.regexist = function(req, res) {
    res.render('message', {title: '用户名已经存在', url: '/reg', layout: 'layout',nav:'reg'});
}

//login
exports.login = function(req, res) {
    //console.dir(req.route);
    if (req.route.method == 'get') {
        res.render('login', {title: '登陆', layout: 'layout',nav:'login'});
    }
    else if (req.route.method == 'post') {
        //生成口令的散列值
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');

        User.get(req.body.username, function(err, user) {
            var cookies = {};
            req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
                var parts = cookie.split('=');
                cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
            });
           
            res.setHeader("Set-Cookie", ["lastusername="+cookies['username']+""]);
            res.setHeader("Set-Cookie", ["username="+req.body.username+""]);
           
            
            if (!user) {
                //req.flash('error', '用戶不存在');
                return res.redirect('/loginerror');
            }
            if (user.password != password) {
                //req.flash('error', '用戶口令錯誤');
                //设置cookie
                
                return res.redirect('/loginerror');
            }
            req.session.user = user;
            //req.flash('success', '登入成功');
            res.redirect('/loginsuccess');
        });
    }
}
exports.loginsuccess = function(req, res) {
    res.render('message', {title: '登陆成功', url: '/', layout: 'layout',nav:'login'});
}
exports.loginerror = function(req, res) {
    var cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    //登录次数增加
    var logintimes = 0;
    if(cookies['logintimes']&&(parseInt(cookies['logintimes']))>0){
        logintimes = parseInt(cookies['logintimes'])+1;
    }else{
        logintimes = 1;
    }
    //console.log("log---:"+logintimes);
    var timestamp=new Date().getTime();
    //时间超过一小时
    if(cookies['lastlogin']){
        var lastlogin = parseInt(cookies['lastlogin']);
        //console.log("date1:"+lastlogin+" nowdata:"+timestamp);
        lastlogin = timestamp - lastlogin;
        //console.log("lastlogin:"+lastlogin);
        if(lastlogin > 3600000){
            logintimes = 1;
        }
    }
    //判断是否同一账户
    if(cookies['lastusername']!=cookies['username']){
        logintimes = 2;
    }
    //console.log("log+++:"+logintimes);
    //设置cookie
    res.setHeader("Set-Cookie", ["lastlogin="+timestamp+"", "logintimes="+logintimes+""]);
    //res.send('cookie opreration');
    res.render('message', {title: '用户名或者密码错误', url: '/login', layout: 'layout',nav:'login'});
}
exports.logout = function(req, res) {
    req.session.user = null;
    //req.flash('success', '登出成功');
    res.redirect('/logoutsuccess');
}
exports.logoutsuccess = function(req, res) {
    res.render('message', {title: '退出成功', url: '/', layout: 'layout',nav:'logout'});
}

//post
exports.post = function(req, res) {
    //console.dir(req.route);
    if(!req.session.user){
        return res.redirect('/loginpost');
    }
    if (req.route.method == 'get') {
        res.render('say', {title: '发表微博', layout: 'layout',nav:'post'});
    }
    else if (req.route.method == 'post') {
        var currentUser = req.session.user;
        var post = new Post(currentUser.name, req.body.post);
        post.save(function(err) {
          if (err) {
            //req.flash('error', err);
            return res.redirect('/');
          }
          //req.flash('success', '發表成功');
          res.redirect('/u/' + currentUser.name);
        });
    }
}
exports.loginpost = function(req, res) {
    res.render('message', {title: '请先登录', url: '/', layout: 'layout',nav:'post'});
}
//user
exports.u = function(req, res) {
    var pager = "";
    var page = req.query.page?req.query.page:1;
    var pagesize = 9;
    console.log(page);
    User.get(req.params.user, function(err, user) {
      if (!user) {
        return res.redirect('/');
      }
     Post.getUserTotal(user.name, function(err, count){
        if (err) {
          return res.redirect('/');
        }
        //console.log(count);
        Post.getUserPage(user.name,page,pagesize, function(err, posts) {
            if (err) {
              return res.redirect('/');
            }

            Pager.show_page(req,page,pagesize,count,'2','',function(showpage){
                console.dir(showpage);//return;
                pager = showpage;
            });
            //console.dir(posts);//return;
            res.render('user', {
              title: user.name,
              layout: 'layout',
              posts: posts,
              pager:pager,
              nav:'u'
            });
          });
      });
      
    });
}
exports.checkccapimg = function(req, res) {
    var ccapimgtxt = req.query.ccapimgtxt;
    console.log(ccapimgtxt);
    console.log(req.session.ccapimg);
    if(ccapimgtxt==req.session.ccapimg){
        res.send('1'); 
    }else{
       res.send('0'); 
    }
}