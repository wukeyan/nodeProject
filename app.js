var express = require('express')
var path = require('path')
var router = require('./router')
var bodyParser = require('body-parser')
var session = require('express-session')  
//在express中默认不支持session和Cookie,但是我们可以使用第三方插件express-session来解决，所以npm i express-session

var app = express()

app.use('/public/',express.static(path.join(__dirname,'./public/')))
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))

//渲染模板引擎
app.engine('html',require('express-art-template'))
app.set('views',path.join(__dirname,'./views/'))  //默认就是view目录，只是写在这里

//处理post 在路由之前
// 配置bodyParse
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

//express不支持Cookie和Session
//用express-session插件来解决
//配置esession：
app.use(session({
    //配置加密字符串,他会在原有md5加密字符串的基础上拼接这个字符串，使密码更加安全
    secret: 'wukeyan', 
    resave: false,
    saveUninitialized: true
}))


//路由挂载到app中
app.use(router)


app.listen(3000,function(){
    console.log('server is running at por 3000...')
})