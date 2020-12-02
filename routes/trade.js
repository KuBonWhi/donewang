var express = require('express');
var router = express.Router();

router.get('/upload_item', function(req, res, next) {
    let session = req.session;

    res.render('trade/upload_item.html', { session: session });
});

router.get('/item', function(req, res, next) {
    let session = req.session;

    res.render('trade/item.html', { session : session });
});

router.get('/item_list', function(req, res, next) {
    let session = req.session;

    res.render('trade/item_list.html', { session : session });
});

router.get('/upload_item', function(req, res, next) {
    let session = req.session;

    res.render('trade/upload_item.html' , { session : session});
});

router.post('/upload_item',async (req,res,next)=>{
    try{
        let body = req.body;

        await model['product_info'].create({
            // title : body.postTitle,
            // author : body.author
            product_id : 2,
            seller_id: 0,
            product_describe: body.message,
            start_price: body.start_price,
            phone_num: 0,
            interest_spon: body.done_percentage,
            product_picture: body.pic,
            duration: body.expire_time
        });
        res.redirect('/trade/upload_item');
    }catch(err){
        console.log(err);
        next(err);
    }
});

router.get('/direct_done', function(req, res, next) {
    let session = req.session;

    res.render('trade/direct_done.html', { session : session});
});

module.exports = router;