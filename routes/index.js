var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main.html', { title: 'Express' });
});

router.get('/index', function(req, res, next) {
  res.render('index.html', { title: 'mono' });
});

router.get('/test', function(req, res, next) {
  res.render('test.html', { title: req.query.id });
});

// router.get('/item_list', function(req, res, next) {
//   res.render('item_list.html', { title: 'Express' });
// });

module.exports = router;
