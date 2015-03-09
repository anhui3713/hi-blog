/**
 * NodeJS API for 会员增删改查登陆注册
 * github: https://github.com/highsea/hi-blog
 * @author Gao Hai <admin@highsea90.com>
 * @link http://highsea90.com
 * @version V0.0.1
 */
var database = require('./../db/userlist_comment_article.js');

exports.index = function(req, res){

    database.userlist.count({living:1}, function(err, doc){

        //req.session.living = err ? err : doc;

        res.render('index', { 
            title: '创业数据库' ,
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
/*        res.render('error',{
            title:"操作错误",
            status:"error",
            message:"用户名或密码为空"
        });*/

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

    login_verify(req, res, function(){

        database.userlist.findById( req.query.id, function(err, doc){
            if (err) {
                jsonTips(req, res, 5001, err, '');
            }else{
                jsonTips(req, res, 2000, 'success', doc);
            }
        })
    })
}

//get查找 全部用户 只显示 name password type
exports.getuser = function(req, res){

    login_verify(req, res, function(){
        database.userlist.find({}, {name : 1, type : 1, password : 1}, {}, function(error, doc){
            json_api(req, res, error, doc);
        })
    });
}

//get 删除 remove 用户
exports.remove1user = function(req, res){

    login_verify(req, res, function (){

        database.userlist.count({_id:req.query.id}, function(err, doc){
            if (err) {
                jsonTips(req, res, 5001, err, '');
            }else{
                if (doc) {
                    database.userlist.remove({_id: req.query.id}, function(error){
                        jsonTips(req, res, '2000', 'success', '数据已经删除');
                    });
                }else{
                    jsonTips(req, res, '2015', 'data not exist', '数据不存在');
                }
            }
        });
    });
}


//更改 update 单个用户信息 get
exports.up1user = function(req, res){

    login_verify(req, res, function (){

        add_update_verify(req, res,function(){
            var r = req.query,
                doc = {name:r.user, password:r.password, type:r.type};
            database.userlist.update({_id:r.id}, doc, {}, function(error){

                json_api(req, res, error, {id:r.id, now:doc});

            });
        });
    });
}


//路由get 新增 后台管理员添加 create 用户
exports.adduserget = function(req, res){

    login_verify(req, res, function(){

        add_update_verify(req, res,function(){
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
            console.log(doc);

            database.userlist.count({name:r.user}, function(err, result){
                if (err) {
                    jsonTips(req, res, 5001, err, '');
                }else{
                    
                    if (result) {
                        jsonTips(req, res, '2014', 'user exist', '用户已经存在');
                    }else{
                        //插入数据库
                        database.userlist.create(doc, function(error){
                            json_api(req, res, error, {id:r.id, now:doc});
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
        jsonTips(req, res, '2013', '需要分类名 name 和该类值 value , 禁止多条件查询', {name:'user|age|city|email|type|living|score|fans|follow|content|time|sex', value:'String|Number|Date|Boolean'});
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
                jsonTips(req, res, '2011', err, '');

            }else{
                if (doc<1) {
                    jsonTips(req, res, '2000', 'ok', doc);
                }else{
                    jsonTips(req, res, '2012', 'success', doc);
                }
            }
        })
    }
}



//方法 用户名 密码 type 验证--用于 更新用户 新建用户
function add_update_verify(req, res, callback){
    var r = req.query;
    if (!r.user||r.user==''||!r.password||r.password==''||!r.type||r.type=='') {
        //||!r.id||r.id==''
        jsonTips(req, res, '2010', '请检查用户名密码以及分类', '');

    }else{
        callback();
    }
}
//方法 登录验证 
function login_verify(req, res, cb){

    var r = req.query;
    var keydoc = {
        name : r.name,
        content : r.key,
        type : 1
    };
    if (!r.name||!r.key||r.name==''||r.key=='') {

        jsonTips(req, res, '2001', '您没有权限，需要密钥哦', '');

    }else{
        //验证密钥
        database.apiKey.find(keydoc, function(error, result){
            if (error||result=='') {

                jsonTips(req, res, '2002', '警告：非法key，你的行为已被记录', error);
            
            }else{
                //开始处理 正真查询 user的 api 
                if (req.session.username=='') {

                    jsonTips(req, res, '2003', '您需要先登录', '');

                }else{
                    //console.log(req.session.username);
                    cb();
                }
            }
        })
    }
}

//方法 jsonp 提示 接口生成

function jsonTips(req, res, code, message, data){

    var str = {
        code : code,
        message : message,
        data : data
    }
    if (req.query.callback) {  
        str =  req.query.callback + '(' + JSON.stringify(str) + ')';
        res.end(str);  
    } else {  
        res.end(JSON.stringify(str));
    } 

}



//方法 jsonp 查询结果接口生成
function json_api(req, res, error, doc){

    var r = req.query;
    if (error) {
        var code = 5001,
            message = error,
            data = '';
    }else {
        var code = 2000,
            message = 'success',
            data = doc;
    }
    var str = {
        'code':code,
        'message':message,
        'data':data
    };

    if (r.callback) {  
        var str =  r.callback + '(' + JSON.stringify(str) + ')';
        res.end(str);  
    } else {  
        res.end(JSON.stringify(str));
    } 
}







