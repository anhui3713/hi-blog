
//$('.user_verify,.user_submit').on('click', function(){
$('.user_submit').on('click', function(){
	var user_user = $.trim($('.user_user').val()), 
		user_password = $.trim($('.user_password').val());
	$('.tips').html('');


	if (checkUser(user_user)) {
		if (!user_password||user_password=='') {
			alertHtml('alert-warning', '对不起：', '您的密码还没填写');
			return false;
		};
		get_userCount('user', user_user);
	}else{
		alertHtml('alert-warning', '对不起：', '用户名必须是字母开头4-16位由字母、数字、下划线组成！不能含有空格等其他字符');
		return false;
	}
})

$('.user_verify').on('click', function(e) {
	e.preventDefault();
	var user_user = $.trim($('.user_user').val());
	$('.tips').html('');
	if (checkUser(user_user)) {
		get_userCount('user', user_user);
	}else{
		alertHtml('alert-warning', '对不起：', '用户名必须是字母开头4-16位由字母、数字、下划线组成！');
		return false;
	}
});


function checkUser(str){
    var re = /^[a-zA-z]\w{3,15}$/;
    if(re.test(str)){
		return true;
    }else{
		return false;
    }    
}


$('.tab_head').on('click', 'li', function(e) {
	e.preventDefault();//mouseenter mouseleave
	$(this).addClass('active').siblings('li').removeClass('active');
	var this_class = $(this).data('cla');
	$('.tab_body').children('.'+this_class).addClass('block').siblings('section').addClass('none').removeClass('block');
});




// alert 提示框 alertHtml('alert-success', 'ok', '可以注册');

function alertHtml(info, title, message){
	$('.tips').append('<div class="alert '+info+'"><button type="button" class="close" data-dismiss="alert">×</button><strong>'+title+'</strong>'+message+'</div>');

}
//查询数量
function get_userCount(name, value, callback){
	jQuery.ajax({
	    type  : "get",
	    async : false,
	    url : '/userCount',
	    dataType : "jsonp",
	    jsonp : "callback",
	    data : {
	        name:name,
	        value:value
	    },
	    jsonpCallback : "dataList",
	    success : function(dataList){
	    	$('.tips').html('');
	    	if (dataList.data==0) {
				alertHtml('alert-success', '成功！', '可以注册');
				callback();
	    	}else{
				alertHtml('alert-warning', '重复！', '该用户数量：'+dataList.data);
	    	}
	    },
	    error : function(){
			alertHtml('alert-danger', '注意：', '网络不稳定，请重试');
	    }
	})
}



/*String.prototype.trim=function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim=function(){
	return this.replace(/(^\s*)/g,"");
}
String.prototype.rtrim=function(){
	return this.replace(/(\s*$)/g,"");
}*/