var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function (req, res) {
  const { username, password } = req.body
  console.log('register', username, password);
  if (username === 'admin') {
    res.send({ code: 1, msg: 'Uer has existed.' })
  } else {
    res.send({ code: 0, data: { _id: 'abc', username, password } })
  }
})

module.exports = router;
