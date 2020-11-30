var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main.html', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  res.render('test.html', { title: req.query.id });
});



module.exports = router;
