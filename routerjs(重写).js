var express = require('express')
var md5 = require('blueimp-md5')  //npm i blueimp-md5
var User = require('./modles/user')
var router = express.Router()

router.get('/', function (req, ret) {
    req.render('index.html', {
        user: req.session.user
    })
})

router.get('/sign', function (req, ret) {
    req.render('sign.html', {

    })
})

router.post('/sign', function (req, ret) {
    var body = req.body
    User.find({
        email: body.email,
        password: md5(md5(body.password))
    }, function (err, user) {
        if (err) {
            return ret.status(500).json({
                err_code: 500,
                message: 'Server is err'
            })
        }
        if (!user) {
            return ret.status(500).json({
                err_code: 1,
                message: 'password or email is invalid'
            })
        }

        ret.session.user = user

        ret.status(200).json({
            err_code: 0,
            message: 'ok'
        })
    })
})

router.get('/register', function (req, ret) {
    req.render('register.html', {

    })
})

router.post('/register', function (req, ret) {
    var body = req.body
    User.findOne({
        $or: [
            {
                email: body.email
            },
            {
                nickname: body.nickname
            }

        ]
    }, function (err, user) {
        if (err) {
            return ret.status(500).json({
                success: false,
                message: '服务端错误'
            })
        }
        if (user) {
            return ret.status(200).json({
                err_code: 1,
                message: 'email or nickname is already exists'
            })
        }
        body.password = md5(md5(body.password))
        new User.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'Server ereor..'
                })
            }
            req.session.user = user

            ret.status(200).json({
                err_code: 0,
                message: 'OK'
            })
        })
    })
})

router.get('/layout',function(req,ret){
    req.session.user = null
    reg.redirect('/sign')
})

module.exports = router