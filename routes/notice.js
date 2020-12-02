var express = require('express');
var router = express.Router();

router.get('/notice', function(req, res, next) {
    let session = req.session;

    res.render('notice/notice.html', { session: session });
});

module.exports = router;