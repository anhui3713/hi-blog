/**
 * 各种小方法，尽管我写的傻
 * github: https://github.com/highsea/hi-blog
 * @author Gao Hai <admin@highsea90.com>
 * @link http://highsea90.com
 */

var database = require('./../db/userlist_comment_article.js');


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

//方法 菜单字母简写 中文名称 验证--用于 更新菜单 新建菜单
function add_update_menu(req, res, callback){
    var r = req.query;

    if (!r.name||r.name==''||r.title==''||!r.title) {
        jsonTips(req, res, '3010', '请检查菜单字母简写和中文名', '');

    }else{
        callback();
    }
}

//方法 管理员操作的 登录验证 
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

exports.add_update_verify 	= add_update_verify;
exports.login_verify  		= login_verify;
exports.jsonTips 			= jsonTips;
exports.json_api 			= json_api;
exports.add_update_menu 	= add_update_menu;
