楼主正在用业余时间开发中…… ，目前的版本仅支持会员系统，尝鲜一下吧~

### hi-blog

+ 一个 nodejs+express+mongodb 的 cms 系统

[![NPM](https://nodei.co/npm/hi-blog.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/hi-blog/)


### 怎么启动

默认你已经安装了 mongodb ；那么你得这样操作：安装项目 -> 初始化管理员 -> 运行项目

1、请先启动 mongodb ，举例：

	$ cd /f/MongoDb/bin/
	$ mongod -dbpath "/f/MongoDb/data/db"

2、初始化管理员 ，举例：

	$ cd /f/MongoDb/bin/&&mongo
	MongoDB shell version: 2.6.6
	connecting to: test
	> use hi-blog
	switched to db hi-blog
	> db.users.insert({name:"admin",password:"123456",type:"1"})
	WriteResult({ "nInserted" : 1 })//添加了管理员
	> db.apikeys.insert({name:"test",content:"123",type:1})
	WriteResult({ "nInserted" : 1 })//添加了操作权限 KEY
	>_

3、安装项目和依赖包，运行项目 

	$ npm install hi-blog
	$ cd hi-blog && npm install
	$ node app


### 怎么使用

1、浏览器打开登陆界面输入 用户名：admin；密码：123456 

	http://localhost:3000/login

如图：（抱歉，还未设置验证码）
![登陆](http://images.cnitblog.com/blog2015/531703/201503/091716509954642.jpg)

2、增删改查用户

需要验证操作权限（key），如图：

![验证](http://images.cnitblog.com/blog2015/531703/201503/091720014646198.jpg)


### V0.0.2功能：

1、用户信息可视化--基于 datatable
2、当前在线人数
3、session--120秒内没有向服务器提交任何新的请求将过期
4、用户管理--新增、更新、删除、查找

### 开发进度

##### Now

+ 还未正式上线，敬请期待……

##### 0.0.4(2015.3.10)

+ 增加 菜单 Schema、routes

##### 0.0.3(2015.3.9)

+ readme 使用说明

##### 0.0.2(2015.3.6)

+ 会员管理系统 支持 增删改查 
+ 查看当前在线人数

##### 0.0.1(2015.3.5)

+ 会员登陆注册 
+ session 支持 


### 需要你得帮助：

[给我提提 Issues](https://github.com/highsea/hi-blog)