var express = require('express')
var md5 = require('blueimp-md5')  //npm i blueimp-md5
var User = require('./modles/user')
var router = express.Router()

router.get('/', function (req, res) {
    res.render('index.html', {
        user: req.session.user
    })
})


//登录
router.get('/sign', function (req, res) {

    res.render('sign.html', {

    })
})

router.post('/sign', function (req, res) {
    // 1. 获取表单数据
    // 2. 查询数据
    // 3. 发送响应
    var body = req.body
    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, function (err, user) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: "服务端错误"
            })
        }

        if (!user) {
            return res.status(500).json({
                err_code: 1,
                message: "Email or password is invalid."
            })
        }
        //用户存在登录成功，使用session记录登录状态
        req.session.user = user

        res.status(200).json({
            err_code: 0,
            message: 'Ok'
        })
    })
})

//注册
router.get('/register', function (req, res) {
    res.render('register.html', {})
})

router.post('/register', function (req, res) {

    var body = req.body

    User.findOne({
        $or: [{
            email: body.email
        },
        {
            nickname: body.nickname
        }
        ]
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                sucsess: false,
                message: '服务端错误'
            })
        }

        if (data) {
            // 邮箱或密码已存在
            return res.status(200).json({
                err_code: 1,
                message: 'Email or nick name already exists!'
            })
        }


        //使用md5对用户密码加密，重复加密
        body.password = md5(md5(body.password))
        //保存注册的数据到数据库
        new User(body).save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'Server ereor..'
                })
            }
            //注册成功，使用session 记录用户的登录状态
            req.session.user = user;

            res.status(200).json({
                err_code: 0,
                message: 'Ok'
            })

        })
    })
})

//退出
router.get('/logout', function (req, res) {
    //清除登录状态
    req.session.user = null
    //返回首页
    res.redirect('/sign')
})

module.exports = router

