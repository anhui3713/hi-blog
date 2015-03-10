/**
 * Routes for 导航、文章分类目录
 * github: https://github.com/highsea/hi-blog
 * @author Gao Hai <admin@highsea90.com>
 * @link http://highsea90.com
 */
var database = require('./../db/userlist_comment_article.js'),
    fun = require('./function.js');

//get 新增 
exports.classifys = function(req, res){
    fun.jsonTips(req, res, '2000', 'message', 'data');
};