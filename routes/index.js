var express = require('express');
var router = express.Router();

const models = require('../models');

// function get_remainTime(data) {
//   let now = new Date();
//
//   for(let index in data) {
//     let expire_time = new Date(data[index].createdAt);
//     expire_time.setHours(data[index].createdAt.getHours() + data[index].duration)
//
//     console.log("올린 시간 : ", data[index].createdAt.toString(), "/duration : ", data[index].duration);
//     console.log("마감 시간 : ", expire_time.toString());
//     console.log("현재 시간 : ", now.toString());
//
//     let diff = expire_time - now;
//     var hour = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     var min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//     var sec = Math.floor((diff % (1000 * 60)) / 1000);
//
//     console.log("남은 시간 : ", hour, '시', min, '분', sec, '초')
//     console.log("\n");
//   }
// }

router.get('/', async (req, res, next) => {
  try {
    let session = req.session;

    //공용계좌 가져오기
    var account = await models['public_account'].findAll({
      //order: 'createdAt DESC',
      //attributes:['product_picture'],
      raw: true
    });
    if(account[0] == undefined){
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

    // ','콤마찍기
    var totalMoney=totalSum; 
    var tempstr = "";
    var i = 0;
    for(;;)
    {
      i++;
      let temp = totalMoney % 10;
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

    //제품사진 가져오기
    const product = await models['product_info'].findAll({
        //order: 'createdAt DESC',
        //attributes:['product_picture'],
        raw: true
    });
    let product_ = null;
    if(product[0] !== undefined){
        product_ = product;
    }

    product_ = models.get_remainTime(product_)

    res.render('main.html', {
      productPic: product_,
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

  var page = req.query.page;
  let keyword = req.query.keyword;
  let session = req.session;

  console.log(req.query)

  try {
    items = await models['product_info'].findAll({
      raw: true,
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

    let item_ = null;
    if(item_ !== undefined) {
      item_ = items;
    }

    res.render('search.html', {
      title: '게시판 리스트',
      rows: item_,
      page : page,
      length : item_.length - 1,
      page_num : 8,
      pass : true,
      keyword : keyword,
      session : session,
    });
    console.log(item_.length - 1, '/', page);

  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/search2', function (req, res, next) {

  res.render('search2.html');

});


module.exports = router;
