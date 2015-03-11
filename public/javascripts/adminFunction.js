/**
 * 管理员专用js（等待 验证）
 * github: https://github.com/highsea/hi-blog
 * @author Gao Hai <admin@highsea90.com>
 * @link http://highsea90.com
 */


//显隐表单
function userClick(dom, cla){
    $('.'+dom).on('click', function(e){
        e.preventDefault();
        $('.'+dom+'_form').toggleClass(cla);
    })
}

userClick('admin_user','block');



//对应元素值
function elm_v(d){
    var v = $('.'+d).val(),
        x = $('[name="'+d+'"]').val();

    if (v!=''&&v!=undefined) {
        return v;
    }else{
        return x;
    }
}

//提交菜单 序列化
$('.add_menu_form > form').submit(function(e) {
    e.preventDefault;
    $('.tips').html('');
    var menu_name = elm_v('menu_name'),
        menu_title = elm_v('menu_title');
    var serialize = $(this).serialize(),
        m_name = elm_v('m_name'),
        m_password = elm_v('m_password');
    if (checkUser(menu_name)) {
        
    };

});


//提交新用户 序列化
$('.add_user_form > form').submit(function(e){
    e.preventDefault;
    $('.tips').html('');
    var add_username = elm_v('add_username'),
        add_password = elm_v('add_password');

    var serialize = $(this).serialize(),
        m_name = elm_v('m_name'),
        m_password = elm_v('m_password');

    if (checkUser(add_username)) {

        if (!add_password||add_password=='') {
            alertHtml('alert-warning', '对不起：', '您的密码还没填写');
            return false;
        }else{
            get_addUser(serialize, m_name, m_password);

        }
    }else{
        alertHtml('alert-warning', '对不起：', '用户名必须是字母开头4-16位由字母、数字、下划线组成！');
        return false;
    }
    return false;
})


//提交 密钥验证
$('.m_submit').on('click', function() {
        var m_name = elm_v('m_name'),
            m_password = elm_v('m_password');
    if (!m_name||!m_password) {
        $('.admin_user_form').find('input').addClass('borderRed');
    }else{
        $('.admin_user_form').removeClass('block');
        getUserAdmin (m_name, m_password);
    }
});



var userType = {
    "0" : "已注销",
    "1" : "管理员",
    "2" : "普通用户",
    "3" : "游客"
};


function table_CURD(d){
    var m_name = elm_v('m_name'),
        m_password = elm_v('m_password');
    
    d.on('click', '.user_save', function(e){
        e.preventDefault;
        var this_closest = $(this).closest('tr');
        var this_name_val = this_closest.find('.us_name').val(),
            this_password_val = this_closest.find('.us_password').val(),
            this_type_val = this_closest.find('.us_type').val(),
            this_id = this_closest.find('.us_id').data('id');
            //console.log(m_name+m_password+this_id+this_name_val+this_password_val+this_type_val)
        get_up1user(m_name, m_password, this_id, this_name_val, this_password_val, this_type_val);

    })
    .on('click', '.user_remove', function(e) {
        e.preventDefault();
        var this_id = $(this).closest('tr').find('.us_id').data('id');
        if(window.confirm('你确定要删除用户吗？操作不可恢复！')){

            get_remove1user(m_name, m_password, this_id)
            //alert("确定");
            return true;
        }else{
            //alert("取消");
            return false;
        }
    })
    .on('click', '.user_info', function(e) {
        e.preventDefault();
        var this_id = $(this).closest('tr').find('.us_id').data('id');
        get_oneuser(m_name, m_password, this_id);
        
    });
}

function install_TB(t,data){
    t.DataTable({
        data:data,
        columns:[
            {data : 'id'},
            {data : 'name'},
            {data : 'password'},
            {data : 'type'},
            {data : 'operate'}
        ],
        "oLanguage": {
        "sLengthMenu": "每页显示 _MENU_ 条",
        "sZeroRecords": "哎哟，找不到……",
        "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
        "sInfoEmpty": "没有数据",
        "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "前一页",
            "sNext": "后一页",
            "sLast": "尾页"
            },
        "sZeroRecords": "没有检索到数据",
        //"sProcessing": "<img src='./loading.gif' />"
        }
    });
}


//获取所有用户 主要信息
function getUserAdmin (name,password) {

    jQuery.ajax({
        type  : "get",
        async : false,
        url : '/getuser',
        dataType : "jsonp",
        jsonp : "callback",
        data : {
            name:name,
            key:password
        },
        jsonpCallback : "dataList",
        success : function(dataList){

            $('.tips').html('');
            if (dataList.code!=2000) {
                alertHtml('alert-warning', dataList.message, '');
            }else{
                var users_list = $('.users_list'),
                    user_table = $('.user_table');  

                var data = dataList.data,
                    dataArr = [];  
                for (var i = 0; i < data.length; i++) {

                    var dataString = {
                            "id"        : "<b class='us_id' data-id='"+data[i]._id+"'>"+i+"</b>",
                            "name"      : "<textarea class='us_name'>"+data[i].name+"</textarea>",
                            "password"  : "<textarea class='us_password'>"+data[i].password+"</textarea>",
                            "type"      : "<textarea class='us_type' title='"+userType[data[i].type]+"' class=''>"+data[i].type+"</textarea>",
                            "operate"   : "<a title='删除用户' class='user_remove icon-remove'></a> . <a title='详细信息' class='user_info icon-th-list'></a> . <a title='保存修改' class='user_save icon-ok'></a>"
                        };
                    dataArr.push(dataString);
                };

                //console.log(dataArr);

                //显示表格
                user_table.addClass('block');
                //初始化表格
                var user_dataTable = $('#user_dataTable');
                //添加 按钮
                $('.administrator')
                .append('<a class="btn add_user btn-primary">新增用户</a> ')
                .append(' <a class="btn add_menu btn-primary">导航菜单</a>');
                //“设置按钮内容”
                userClick('add_user','block');
                userClick('add_menu','block');

                
                install_TB(user_dataTable, dataArr);

                table_CURD(user_dataTable);

            }

        },
        error: function(){
            $('.tips').append('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button><strong>出错了!</strong> 网络不稳定，请重试</div>');
        }
    });

}

//获取单用户信息 get_oneuser
function get_oneuser(name, key, id){
    jQuery.ajax({
        url: '/oneuser',
        type: 'get',
        dataType: 'jsonp',
        jsonp:"callback",
        data: {
            id: id,
            name:name,
            key:key
        },
        jsonpCallback : "dataList",
        success: function(dataList) {
            $('.tips').html('');
            if (dataList.code==2000) {
                alertHtml('alert-success', '用户信息：', '<textarea>'+JSON.stringify(dataList.data)+'</textarea>');
            }else{
                alertHtml('alert-info', '不存在', '获取用户信息失败');
            }

        },
        error : function() {
            alertHtml('alert-danger', '注意：', '网络不稳定，请重试');
        }
    })
}


//删除 单用户
function get_remove1user(name, key, id){
    jQuery.ajax({
    url: '/remove1user',
    type: 'get',
    dataType: 'jsonp',
    jsonp:"callback",
    data: {
        id: id,
        name:name,
        key:key
    },
    jsonpCallback : "dataList",
    success: function(dataList) {
        $('.tips').html('');
        //console.log(dataList);
        var code = dataList.code;
        if (code==2000) {
            alertHtml('alert-success', '很好!', '您已经删除');
        }else{
            alertHtml('alert-info', '对不起!', '请刷新后重试');
        }
    },
    error: function() {
        alertHtml('alert-danger', '注意：', '网络不稳定，请重试');
    }
    });
    

}



//新增 单用户
function get_addUser(serialize, name, key){
    jQuery.ajax({
        type  : "get",
        async : false,
        url : '/adduserget?'+serialize,
        dataType : "jsonp",
        jsonp : "callback",
        data : {
            name:name,
            key:key
        },
        jsonpCallback : "dataList",
        success : function(dataList){
            $('.tips').html('');
            var code = dataList.code,
                message = dataList.message,
                data = dataList.data;

            if (code==2000) {
                
                alertHtml('alert-success', '很好!', '您添加成功了');

            } else if (code == 2001) {
                alertHtml('alert-info', '注意：', message);
            } else if (code == 2002) {
                alertHtml('alert-warning', '危险：', message);
            } else if (code == 2003) {
                alertHtml('alert-info', '注意：', message);
            } else{
                alertHtml('alert-info', '注意：', JSON.stringify(message));

            }
        },
        error : function(){
            alertHtml('alert-danger', '注意：', '网络不稳定，请重试');
        }
    })
}



//更新单用户信息 get_up1user
function get_up1user (name, key, id, user, password, type) {

    jQuery.ajax({
        type  : "get",
        async : false,
        url : '/up1user',
        dataType : "jsonp",
        jsonp : "callback",
        data : {
            name:name,
            key:key,
            id:id,
            user:user,
            password:password,
            type:type
        },
        jsonpCallback : "dataList",
        success : function(dataList){
            $('.tips').html('');
            //console.log(dataList);
            var code = dataList.code;
            if (code==2000) {
                alertHtml('alert-success', '很好!', '您更新成功了');
            }else{
                alertHtml('alert-info', '对不起!', '请刷新后重试');
            }
        },
        error: function(){
            alertHtml('alert-danger', '注意：', '网络不稳定，请重试');
        }
    })
}


