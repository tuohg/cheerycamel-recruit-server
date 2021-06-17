var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')

const UserModel = require('../db/models').UserModel
const filter = { password: 0, _v: 0 }

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function (req, res) {

  const { username, password, type } = req.body

  UserModel.findOne({ username }, function (err, user) {
    if (user) {
      res.send({ code: 1, msg: 'User has existed!' })
    } else {
      new UserModel({ username, password: md5(password), type }).save(function (err, user) {
        if (!err) {
          res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 })
          res.send({ code: 0, data: { _id: user._id, username, type } })

        } else {
          res.send({ code: 1, msg: err })
        }
      })
    }
  })
  // console.log('register', username, password);
  // if (username === 'admin') {
  //   res.send({ code: 1, msg: 'Uer has existed.' })
  // } else {
  //   res.send({ code: 0, data: { _id: 'abc', username, password } })
  // }
})

router.post('/login', function (req, res) {
  const { username, password } = req.body

  UserModel.findOne(
    { username, password: md5(password) }, filter, function (err, user) {
      if (!err) {
        if (!user) {
          res.send({ code: 1, msg: 'Username or password is invalid!' })
        } else {
          res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 })
          res.send({ code: 0, data: user })
        }
      }
    })
})

router.post('/update', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    return res.send({ code: 1, msg: 'Please sign in first!' })
  }

  UserModel.findByIdAndUpdate({ _id: userid }, req.body, function (err, user) {
    const { _id, username, type } = user

    const data = Object.assign(req.body, { _id, username, type })

    res.send({ code: 0, data })
  })
})

router.get('/user', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    return res.send({ code: 1, msg: 'Please sign in first!' })
  }

  UserModel.findOne({ _id: userid }, fileter, function (err, user) {
    return res.send({ code: 0, data: user })
  })
})

router.get('/list', function (req, res) {
  const { type } = req.query
  UserModel.find({ type }, function (err, users) {
    return res.json({ code: 0, data: users })
  })
})

module.exports = router;
