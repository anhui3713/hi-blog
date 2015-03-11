/**
 * Routes for 会员增删改查登陆注册
 * github: https://github.com/highsea/hi-blog
 * @author Gao Hai <admin@highsea90.com>
 * @link http://highsea90.com
 */
var database = require('./../db/userlist_comment_article.js'),
    fun = require('./function.js');

exports.index = function(req, res){

    database.userlist.count({living:1}, function(err, doc){

        //req.session.living = err ? err : doc;

        res.render('index', { 
            title: 'CMS管理系统' ,
            result:0,//未登录
            living: err ? err : doc
        });

    })

};

exports.login = function(req, res){
    if (req.session.username&&req.session.result!='') {
        console.log(req.session.username);
        console.log(req.session.result);
        res.redirect('/home');
    }else{
        res.render('login', {
            title:"登陆页面",
            result:0,//未登录
        });
    }

};

//home get
exports.homeget = function(req, res) {
    if (req.session.username) {
        res.render('home', {
            title : '后台',
            username : req.session.username,
            result : req.session.result,
            date : new Date()
        });
    }else{
        res.redirect('/');
    }
}

// home post
exports.homepost = function(req, res){
    var query = {name: req.body.user.trim(), password: req.body.password.trim()};
    if(query.name==''||query.password==''){
        res.redirect('/error');
    }else{
        database.userlist.find(query, function(error, result){   
            if (error) {
                res.end(error);
            }else{
                //省去判断 result=0  =1
                req.session.username = query.name;
                req.session.result = result;
                res.render('home', {
                    title : '后台',
                    username : req.session.username,
                    result : result,
                    date : new Date()
                });

                //在线状态
                database.userlist.update(query, {living:1}, function(err, result){
                    console.log('在线：'+result);//result为更新后的对象
                });

            }
        });
    }
}

// logout
exports.logout = function(req, res){

    //更新离线
    database.userlist.update({name:req.session.username}, {living:0}, function(err, result){
        console.log('离线：'+result);
    });

    req.session.username = null;
    req.session.result = null;
    res.redirect('/');

};

// 注册
exports.register = function(req, res){
    res.render('register', {
        title: "注册页面",
        result:0,//未登录
        resultREG:0//未注册
    })
}

//新增 create 前台注册用户 （单个）
exports.adduser = function(req, res){
    var query = {name: req.body.user, password: req.body.password};
    if(query.name==''||query.password==''){
        res.redirect('/error');
    }else{

        database.userlist.create(query, function(error){
            if (error) {
                res.end(error);
            }else{
                console.log('注册成功');
                res.render('register', {
                    title: "注册页面",
                    result:0,//未登录
                    resultREG:1//注册成功
                })
            }
        })
    }
}

// get查找单用户 显示全部键值
exports.oneuser = function (req, res){

    fun.login_verify(req, res, function(){

        database.userlist.findById( req.query.id, function(err, doc){
            if (err) {
                fun.jsonTips(req, res, 5001, err, '');
            }else{
                fun.jsonTips(req, res, 2000, 'success', doc);
            }
        })
    })
}

//get查找 全部用户 只显示 name password type
exports.getuser = function(req, res){

    fun.login_verify(req, res, function(){
        database.userlist.find({}, {name : 1, type : 1, password : 1}, {}, function(error, doc){
            fun.json_api(req, res, error, doc);
        })
    });
}

//get 删除 remove 用户
exports.remove1user = function(req, res){

    fun.login_verify(req, res, function (){

        database.userlist.count({_id:req.query.id}, function(err, doc){
            if (err) {
                fun.jsonTips(req, res, 5001, err, '');
            }else{
                if (doc) {
                    database.userlist.remove({_id: req.query.id}, function(error){
                        fun.jsonTips(req, res, '2000', 'success', '数据已经删除');
                    });
                }else{
                    fun.jsonTips(req, res, '2015', 'data not exist', '数据不存在');
                }
            }
        });
    });
}


//更改 update 单个用户信息 get
exports.up1user = function(req, res){

    fun.login_verify(req, res, function (){

        fun.add_update_verify(req, res,function(){
            var r = req.query,
                doc = {name:r.user, password:r.password, type:r.type};
            database.userlist.update({_id:r.id}, doc, {}, function(error){

                fun.json_api(req, res, error, {id:r.id, now:doc});

            });
        });
    });
}


//路由get 新增 后台管理员添加 create 用户
exports.adduserget = function(req, res){

    fun.login_verify(req, res, function(){

        fun.add_update_verify(req, res,function(){
            var r = req.query;
            var doc = {
                name        : r.user,
                password    : r.password,
                content     : r.content,
                age         : r.age,
                city        : r.city,
                email       : r.email,
                type        : r.type
            };
            //console.log(doc);

            database.userlist.count({name:r.user}, function(err, result){
                if (err) {
                    fun.jsonTips(req, res, 5001, err, '');
                }else{
                    
                    if (result) {
                        fun.jsonTips(req, res, '2014', 'user exist', '用户已经存在');
                    }else{
                        //插入数据库
                        database.userlist.create(doc, function(error){
                            fun.json_api(req, res, error, {id:r.id, now:doc});
                        })
                    }
                }
            })

        })
    })
}


//路由 数据库 分类+数量 count 查询 多功能接口（可用户 新建 删除相关分类数据）
exports.userCount = function (req, res){

    var countname = req.query.name,
        countvalue = req.query.value,
        q_count = {countname:countvalue};

    if (!countname||!countvalue||countname=='password'||q_count.length>1) {
        fun.jsonTips(req, res, '2013', '需要分类名 name 和该类值 value , 禁止多条件查询', {name:'user|age|city|email|type|living|score|fans|follow|content|time|sex', value:'String|Number|Date|Boolean'});
    }else{
        var coutListArr = {
            'userid': {_id:countvalue},
            'user'  : {name : countvalue},
            'age'   : {age : countvalue},
            'city'  : {city:countvalue},
            'email' : {email:countvalue},
            'type'  : {type:countvalue},
            'living': {living:countvalue},
            'score' : {score:countvalue},
            'fans'  : {fans:countvalue},
            'follow': {follow:countvalue},
            'content': {content:countvalue},
            'time'  : {time:countvalue},
            'sex'   : {sex:countvalue}
        }
        console.log(coutListArr[countname]);
        database.userlist.count(coutListArr[countname], function(err, doc){

            if (err) {
                fun.jsonTips(req, res, '2011', err, '');

            }else{
                if (doc<1) {
                    fun.jsonTips(req, res, '2000', 'ok', doc);
                }else{
                    fun.jsonTips(req, res, '2012', 'success', doc);
                }
            }
        })
    }
}






