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

    //추천제품사진 가져오기(후원비율 높은순), 16개만 가져옴
    const product = await models['product_info'].findAll({
        order: [['interest_spon', 'DESC']],
        //attributes:['product_picture'],
        raw: true,
        limit: 16,
    });
    let product_ = null;//후원 비율 높은애 변수
    if(product[0] !== undefined){
        product_ = product;
    }
    product_ = models.get_remainTime(product_);
    //console.log('product_:\n',product_);

    //전체 제품 중 남은시간 적은 제품 고르기
    let product_late = await models['product_info'].findAll({
      order: [['interest_spon', 'DESC']],
      //attributes:['product_picture'],
      raw: true,
  });;
    product_late = models.get_remainTime(product_late);
    product_late.sort(function(a,b){
      //console.log('a: ',a.int_remain_time, '\nb: ',b.int_remain_time);
      return a.int_remain_time -b.int_remain_time;
    });
    //console.log('late:\n',product_late);

    res.render('main.html', {
      productPic: product_,
      session : session,
      totSum : monoSum,
      product_late: product_late,
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
  let id = req.query.id;
  let bid = req.query.bid;
  let session = req.session;

  console.log(req.query)

  if(keyword != undefined && id == undefined && bid == undefined) {
    console.log("id 없을때")
    try {
      items = await models['product_info'].findAll({
        raw: true,
        where:
            {
              //title: {[Op.like]: "%" + keyword + "%"}
              [Op.or] : [
                {
                  title: {[Op.like]: "%" + keyword + "%"}
                },
                {
                  product_describe: {[Op.like]: "%" + keyword + "%"}
                }
              ]
            }
      });

      let item_ = null;
      if (item_ !== undefined) {
        item_ = items;
      }

      item_ = models.get_remainTime(item_);

      res.render('search.html', {
        title: '게시판 리스트',
        rows: item_,
        page: page,
        length: item_.length - 1,
        page_num: 8,
        pass: true,
        keyword: keyword,
        session: session,
      });
      console.log(item_.length - 1, '/', page);

    } catch (err) {
      console.error(err);
      next(err);
    }
  }
  else if (keyword == undefined && id != undefined && bid == undefined) {
    console.log("id만 있을때")
    try {
      items = await models['product_info'].findAll({
        raw: true,
        where:
            {
              seller_id : id
            }
      });

      let item_ = null;
      if (item_ !== undefined) {
        item_ = items;
      }

      item_ = models.get_remainTime(item_);

      res.render('search.html', {
        title: '게시판 리스트',
        rows: item_,
        page: page,
        length: item_.length - 1,
        page_num: 8,
        pass: true,
        keyword: keyword,
        session: session,
      });
      console.log(item_.length - 1, '/', page);

    } catch (err) {
      console.error(err);
      next(err);
    }
  }
  else if (keyword == undefined && id == undefined && bid != undefined) {
    console.log("id만 있을때")

    let buy_hist = await model['bid_history'].findAll({
      where: {
        member_id: session.user.id,
      },
      raw: true,
    });
    console.log('buy_hist:\n', buy_hist);
    if (buy_hist[0] == undefined) {
      console.log('mybuy[0] undefined');
      buy_hist = null;
    }
    //console.log('buy len:',buy_hist.length);
    let my_buy_length;
    let my_sell_length;
    let my_buy = [];
    if (buy_hist) {
      console.log('buy_hist is not null');
      for (let idx in buy_hist) {
        let buy_product_info = await model['product_info'].findAll({
          where: {
            product_id: buy_hist[idx].product_id,
          },
          raw: true,
        });
        my_buy[idx] = buy_product_info[0];
        my_buy[idx].bid_price = buy_hist[idx].bid_price;
      }
      my_buy_length = my_buy.length;
      my_sell_length = my_sell.length;
    } else {
      my_buy = null;
      my_buy_length = 0;
      my_sell_length = 0;
    }

    item_ = my_buy;

    res.render('search.html', {
      title: '게시판 리스트',
      rows: item_,
      page: page,
      length: item_.length - 1,
      page_num: 8,
      pass: true,
      keyword: keyword,
      session: session,
    });
  }
});

router.get('/search2', function (req, res, next) {

  res.render('search2.html');

});


module.exports = router;
