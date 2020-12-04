var express = require('express');
var router = express.Router();

const models = require('../models');

router.get('/', async (req, res, next) => {
  try {
    let session = req.session;

    //공용계좌 가져오기
    var account = await models['public_account'].findAll({
      //order: 'createdAt DESC',
      //attributes:['product_picture'],
      raw: true
    });
    console.log('account: ', account[0]);
    if(account[0] == undefined){
      console.log('create publicinfo');
      await models['public_account'].create({
        depositor_id: 0,
        donation: 9509030,
        total_sum: 9509030,
      });
      account = await models['public_account'].findAll({
        //order: 'createdAt DESC',
        //attributes:['product_picture'],
        raw: true
      });
    }
    totalSum = account[0]['total_sum'];
    console.log('totalsum : ',totalSum, ', type:',typeof(totalSum));

    // ','콤마찍기
    var totalMoney=totalSum; 
    var tempstr = "";
    var i = 0;
    for(;;)
    {
      i++;
      let temp = totalMoney % 10;
      console.log('totmoney:',totalMoney);
      totalMoney = Math.floor(totalMoney / 10);
      if(totalMoney == 0 && temp == 0)
        break;
      tempstr = temp.toString() + tempstr;
      if(i == 3) {
        if(totalMoney == 0 && temp == 0)
        break;
        tempstr = ','+tempstr;
        i = 0;
      }
    }
    var monoSum = tempstr;
    console.log(monoSum);

    //제품사진 가져오기
    const product = await models['product_info'].findAll({
        //order: 'createdAt DESC',
        //attributes:['product_picture'],
        raw: true
    });
    console.log('product: ', product.length);
    let product_pic = null;
    console.log('ppic: ',product_pic);
    if(product[0] !== undefined){
        console.log('if문 안');
        product_pic = product;
    }

    res.render('main.html', {
      productPic: product_pic,
      session : session,
      totSum : monoSum
      //productPic : 'uploads/fig.LinkState1607002337230.png'
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
  // res.render('main.html', { title: 'Express' });
});

const sequelize = require("sequelize");
const Op = sequelize.Op;

router.get('/search', async (req, res, next) => {
  let keyword = req.query.keyword;

  console.log(req.query)

  try {
    items = await models['product_info'].findAll({
      where:
          {
            title: {[Op.like]: "%" + keyword + "%"}

            // $or: [
            //   {
            //     product_describe: {[Op.like]: "%" + keyword + "%"}
            //   },
            //   {
            //     title: {[Op.like]: "%" + keyword + "%"}
            //   }
            // ]
          }
    });


    //       {
    //       $or: [
    //       {
    //     product_describe : { [Op.like] : "%" + keyword + "%"},
    //     title : { [Op.like] : "%" + keyword + "%" }
    //   }
    //   ]
    // }


    res.send(items)

    // res.render('main.html', {
    //   productPic: product_pic,
    //   session : session,
    //   totSum : monoSum
    //   //productPic : 'uploads/fig.LinkState1607002337230.png'
    // });
  } catch (err) {
    console.error(err);
    next(err);
  }
});


module.exports = router;
