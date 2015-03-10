/**
 * mongoose Schema 会员集合；评论；文章；栏目（菜单）；权限KEY
 * github: https://github.com/highsea/hi-blog
 * @author Gao Hai <admin@highsea90.com>
 * @link http://highsea90.com
 */
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/hi-blog');
// 链接错误
db.on('error', function(error) {
    console.log(error);
});
var Schema = mongoose.Schema;

var userSchema =new Schema({
    //_id     : Schema.Types.ObjectId,  //主键
    name    : {type:String,required:true},
    password: String,
    content : String, //简介
    age     : {type:Number,min:0,max:110},
    city    : String,
    time    : {type : Date, default: Date.now},
    email   : String,
    sex     : {type:Boolean,default:1}, //男1 女0
    type    : {type:Number,default:2}, //注销 0 管理员 1 普通用户 2 订阅者 3 游客（禁言禁文） 4 被禁评论的用户 5 被禁发表文章的用户 6
    //comment : {type:Boolean,default:1}, //启用评论 1 禁止灌水 0
    //article : {type:Boolean,default:1}, // 启用文章 1 禁言 0
    //enable  : {type : Boolean, default: 1}, // 用户启用 1 注销 0
    living  : {type:Number,default:0}, //在线 1 离线 0 隐身 2
    score   : {type:Number,default:0}, //积分
    follow  : {type:Number,default:0}, // 关注
    fans    : {type:Number,default:0} //粉丝
    //addby   : {type:Number,default:0} //通过
});

var commentSchema =new Schema({
    //_id     : Schema.Types.ObjectId,  //主键
    name    : {type:String,required:true}, // 评论的用户
    content : String, // 内容
    time    : {type : Date, default: Date.now},
    title   : String, 
    zan     : Number, // 获赞数
    reply   : Number, // 回复数
    forward : Number, // 转发
    type    : Number //垃圾评论放入回收站 0 正常1 
});

var articleSchema =new Schema({
    //_id     : Schema.Types.ObjectId,  //主键
    name    : {type:String,required:true}, // 该文章用户
    content : String, // 内容
    time    : {type : Date, default: Date.now},
    title   : String, 
    zan     : Number, // 获赞数
    reply   : Number, // 回复数
    //forward : Number, // 转发
    like    : Number, //收藏数
    type    : Number, //垃文章论放入回收站 0 正常1 原创 2 推荐 3
    classify: String //文章的类目
});

var classifySchema = new Schema({
    name    : String,//英文缩写
    title   : String,//中文导航
    content : String,//菜单介绍
    parent  : String//空为顶级，有父级写父级的 name
})

var apiKeySchema = new Schema({
    name    : {type:String,required:true}, // Key 的名称
    content : String, //key的具体 value
    time    : {type : Date, default: Date.now},
    type    : {type : Number, default: 1} // 默认启用 1 禁用 0 初步限制 2
})

exports.userlist = db.model('users', userSchema);
exports.comment = db.model('comments', commentSchema);
exports.article = db.model('articles', articleSchema);
exports.apiKey = db.model('apiKeys', apiKeySchema);
exports.classify = db.model('classifys', classifySchema);


