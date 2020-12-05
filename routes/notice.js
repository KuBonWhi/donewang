var express = require('express');
var router = express.Router();

router.get('/notice', function(req, res, next) {
    let session = req.session;

    res.render('notice/notice.html', { session: session });
});

router.get('/notice_detail', function(req, res, next) {
    let session = req.session;

    res.render('notice/notice_detail.html', { session: session });
});

router.get('/write_notice', function(req, res, next) {
    let session = req.session;

    res.render('notice/write_notice.html', { session: session });
});

module.exports = router;