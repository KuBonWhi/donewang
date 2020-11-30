var express = require('express');
var router = express.Router();

router.get('/upload_item', function(req, res, next) {
    res.render('trade/upload_item.html', { title: 'Express' });
});

router.get('/item', function(req, res, next) {
    res.render('trade/item.html', { title: 'Express' });
});

router.get('/item_list', function(req, res, next) {
    res.render('trade/item_list.html', { title: 'Express' });
});


module.exports = router;