var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var db=require('../db');
var User=require('../models/user');
var Post=require('../models/post');
var dateFormat = require('dateformat');

/* GET home page. */
router.get('/', function(req, res, next) {
    Post.find({},function(err,posts){
        if(err){
            req.session.message=err.message;
            return res.redirect('/');
        }
        res.render('index',{
            posts:posts
        });
    });

});

// 删除微博
router.get('/rempost/:id',function(req,res){
    if (req.session.user && req.session.user != undefined) {
        Post.remove({'_id':req.params.id},function(err){
            return res.redirect('/');
        })
    }else{
        return res.redirect('/login');
    }
});

router.get('/test',function(req,res){
    res.render('test');
});
router.get('/testone',function(req,res){
    res.render('testone',{name:'123kuaikuaikuai',email:'124@123.com',friends:10});
});

// 发表微博
router.post('/post',function(req, res, next){
    var currentUser=req.session.user;
    var post=new Post({
        user:currentUser.name,
        post:req.body.article,
        updated:getTime()/*Date.now()*/
    });
    post.save(function(err){
        if(err){
            req.session.message=err.message;
            return  res.redirect('/reg');
        }
        req.session.success="发表成功";
        res.redirect('/users/'+currentUser.name);
    });


});

function getTime(){
   return dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss");
}
router.get('/reg', isLogin);
//用户进入注册页面
router.get('/reg',function(req,res){
    res.render('reg',{title:"用户注册"});
});
router.post('/reg', isLogin);
//用户点击注册按钮
router.post('/reg',function(req,res){
   if(req.body['password']!= req.body['passwordconf']){
       req.session.error="两次密码不一致";
       return res.redirect('/reg');
   }
    var md5=crypto.createHash('md5');
    var password=md5.update(req.body.password).digest('base64');
    var newUser=new User({
        name:req.body['username'],
        password:password
    });
    User.findOne({name:newUser.name},function(err,user){
        if(user){
            err="用户名已经存在";
        }
        if(err){
           req.session.error=err;
           return  res.redirect('/reg');
        }
        newUser.save(function(err){
            if(err){
                req.session.error=err.message;
                return  res.redirect('/reg');
            }
            req.session.user=newUser;
            req.session.success="注册成功";
            res.redirect('/');
        });
    });
});
router.get('/login',isLogin);
router.get('/login',function(req,res){
    res.render('login',{title:"用户登陆"});
});
router.post('/login',isLogin);
router.post('/login',function(req,res){
    var md5=crypto.createHash('md5');
    var password=md5.update(req.body.password).digest('base64');
    User.findOne({name:req.body.username},function(err,user){
        if(!user){
            req.session.error="用户不存在";
            return res.redirect('/login');
        }
        if(user.password!=password){
            req.session.error="密码错误";
            return  res.redirect('/login');
        }
            req.session.user=user;
            req.session.success="登录成功";
            res.redirect('/');
    });
});
router.get('/logout',function(req,res){
    req.session.user=null;
    res.redirect('/');
});
function isLogin(req,res,next){
    if(req.session.user){
        req.session.message="用户已登录";
        return res.redirect('/');
    }
    next();
}

module.exports = router;
