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

router.get('/upload_item', function(req, res, next) {
    res.render('trade/upload_item.html');
});

router.post('/upload_item',async (req,res,next)=>{
    let body = req.body;

    model['product_info'].create({
        // title : body.postTitle,
        // author : body.author
        product_id : item_num,
        seller_id: 0,
        product_describe: body.message,
        start_price: body.start_price,
        phone_num: 0,
        interest_spon: body.done_percentage,
        product_picture: body.pic,
        duration: body.expire_time
    })
        .then(result => {
            console.log("success");
        })
        .catch(err => {
            console.log("fail");
            console.log(err);
        })
});

module.exports = router;