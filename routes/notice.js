var express = require('express');
var router = express.Router();

router.get('/notice', function(req, res, next) {
    res.render('notice/notice.html', { title: 'Express' });
});

module.exports = router;