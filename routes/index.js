var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')

const models = require('../db/models')
const UserModel = models.UserModel
const ChatModel = models.ChatModel

const filter = { password: 0, _v: 0 }

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/register', function (req, res) {

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

router.post('/api/login', function (req, res) {
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

router.post('/api/update', function (req, res) {
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

router.get('/api/user', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    return res.send({ code: 1, msg: 'Please sign in first!' })
  }

  UserModel.findOne({ _id: userid }, filter, function (err, user) {
    return res.send({ code: 0, data: user })
  })
})

router.get('/api/list', function (req, res) {
  const { type } = req.query
  UserModel.find({ type }, function (err, users) {
    return res.json({ code: 0, data: users })
  })
})

router.get('/api/msglist', function (req, res) {
  const userid = req.cookies.userid

  UserModel.find(function (err, userDocs) {
    const users = {}
    userDocs.forEach(doc => {
      users[doc._id] = { username: doc.username, avatar: doc.avatar }
    })

    ChatModel.find({ '$or': [{ from: userid }, { to: userid }] }, filter, function (err, chatMsgs) {

      res.send({ code: 0, data: { users, chatMsgs } })
    })
  })
})

router.post('/api/readmsg', function (req, res) {
  const from = req.body.from
  const to = req.cookies.userid

  ChatModel.update({ from, to, read: false }, { read: true }, { multi: true }, function (err, doc) {
    console.log('/readmsg', doc);
    res.send({ code: 0, data: doc.nModified })
  })
})

module.exports = router;
