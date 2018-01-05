var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('test', { title: '「跳一跳」Canvas 点识别测试算法准确度' });
});

module.exports = router;
