var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let session = req.session;

  res.render('main.html', { session : session });
});

module.exports = router;
