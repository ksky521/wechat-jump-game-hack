var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('demo', { title: '「跳一跳」Canvas 点识别' });
});

module.exports = router;
