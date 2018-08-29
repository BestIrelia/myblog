const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')
const winston = require('winston')
const expressWinston = require('express-winston')

const app=express()

//引入处理post数据模块
var bodyParser = require('body-parser');
//引入ueditor
const ueditor = require("ueditor")

//设置模板目录
app.set('views',path.join(__dirname,'views'))
//设置模板引擎为ejs
app.set('view engine','ejs')

//设置静态文件目录

//session中间件
app.use(session({
    name:config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret:config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave:true,//强制更新session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie:{
        maxAge:config.session.maxAge//过期时间，过期后cookie中的session id自动删除
    },
    store:new MongoStore({//将session存储到MongoDB
        url:config.mongodb//MongoDB地址
    })
}))
//flash中间件，用来显示通知
app.use(flash())

// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
//
// //更改限定大小
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// // parse application/json
// app.use(bodyParser.json())
const urlencodedParser=bodyParser.urlencoded({ extended: false });

app.use("/ueditor/ue",urlencodedParser, ueditor(path.join(__dirname, 'public'), function(req, res, next) {
    //客户端上传文件设置
    var imgDir = '/img/ueditor/'
    var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = imgDir; //默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/file/ueditor/'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/video/ueditor/'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    // 客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = imgDir;
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('../nodejs/config.json');
        next()
    }
}));
app.use(express.static(path.join(__dirname,'public')))

//处理表单及文件上传的中间件
app.use(require('express-formidable')({
    uploadDir:path.join(__dirname,'public/img'),//上传文件目录
    keepExtensions:true,//保留后缀
}))

//设置模板全局变量
app.locals.blog={
    title:pkg.name,
    description:pkg.description
}

//添加模板必需的三个变量
app.use(function (req,res,next) {
    res.locals.user=req.session.user
    res.locals.success=req.flash('success').toString()
    res.locals.error=req.flash('error').toString()
    next()
})

// 正常请求的日志
app.use(expressWinston.logger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}))
// 路由
routes(app)
// 错误请求的日志
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}))

//error
app.use(function (err,req,res,next) {
    console.error(err)
    req.flash('error',err.message)
    res.redirect('/posts')
})

//监听端口，启动程序
app.listen(config.port,function () {
    console.log(`${pkg.name} listening on port ${config.port} ${new Date()}`)
})