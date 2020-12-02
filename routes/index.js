var express = require('express');
var router = express.Router();

const models = require('../models');

router.get('/', async (req, res, next) => {
  try {
    let session = req.session;
    const product = await models['product_info'].findAll({
        //order: 'createdAt DESC',
        //attributes:['product_picture'],
        raw: true
    });
    console.log('product: ', product);
    let product_pic = null;
    console.log('ppic: ',product_pic);
    if(product[0] !== undefined){
        console.log('if문 안');
        product_pic = product[0]['product_picture'];
    }
    //console.log('product0번!!!!!:\n',product,'\n');
    //product[0]['product_picture']
    res.render('main.html', {
      productPic: product_pic,
      session : session
      //productPic : '/uploads/fig.LinkState1606895231941.png'
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
  // res.render('main.html', { title: 'Express' });
});

/* GET home page. */
// router.get('/', function(req, res, next) {
//   let session = req.session;

//   res.render('main.html', { session : session });
// });



module.exports = router;
