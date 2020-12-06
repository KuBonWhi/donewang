var express = require('express');
var router = express.Router();
var model = require('../models');
const crypto = require('crypto'); // 암호화에 필요한 API

/* GET users listing. */
router.get('/my_info', async (req, res, next) => {
  try{
    let session = req.session;

    let result = await model['member_info'].findOne({
      where: {
        id : session.user.id
      }
    });

    let address = string.split('/');

    res.render("users/my_info.html" , {
      session : session,
      info : result,
      zipcode : address[0],
      addr1 : address[1],
      addr2 : address[2]
    });

  }catch(err){
    console.log(err);
    next(err);
  }
});

router.get('/find_id_result', function(req, res, next) {
  let session = req.session;

  res.render("users/find_id_result.html" , { session : session});
});

router.get('/find_passwd_result', function(req, res, next) {
  let session = req.session;

  res.render("users/find_passwd_result.html" , { session : session});
});

router.get('/confirm_myInfo', function(req, res, next) {
  let session = req.session;

  res.render("users/confirm_myInfo.html" , { session : session});
});

router.post('/confirm_myInfo',async (req,res,next)=>{
  try{
    let body = req.body;
    let session = req.session;

    let result = await model['member_info'].findOne({
      where: {
        id : session.user.id
      }
    });

    // let dbPassword = result.dataValues.password;
    // let inputPassword = body.password;
    // let salt = result.dataValues.salt;
    // let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

    if(result.password == body.pwd)
    {
      console.log("비밀번호 일치");
      res.redirect("/users/my_info");
    }
    else
    {
      session.message = "wrong_pw";
      console.log("잘못된 비밀번호");
      res.render("users/confirm_myInfo.html", { session : session });
    }

  }catch(err){
    console.log(err);
    next(err);
  }
});

router.get('/my_tradeInfo', async function(req, res, next) {
  let session = req.session;
  if(session.user === undefined)
    {   
        session.loginAlert = true;
        res.redirect("/users/login")
    }
  //let userId = session.user.id;
  let my_info = await model['member_info'].findOne({
    where: {
      id : session.user.id,
    },
    raw:true,
  });
  let my_sell = await model['product_info'].findAll({
    where: {
      seller_id : session.user.id,
    },
    raw:true,
  });
  console.log('mysell :\n',my_sell);
  if(my_sell[0] == undefined){
    console.log('mysell[0] undefined');
    my_sell = null;
  }
  
  // let my_buy_ = await model['bid_history'].findAll({
  //   where: {
  //     member_id : session.user.id,
  //   },
  //   raw:true,
  // });
  // if(my_buy_[0] == undefined){
  //   my_buy_ = null;
  // }

  let buy_hist = await model['bid_history'].findAll({
    where: {
      member_id : session.user.id,
    },
    raw:true,
  });
  console.log('buy_hist:\n',buy_hist);
  if(buy_hist[0] == undefined){
    console.log('mybuy[0] undefined');
    buy_hist = null;
  }
  //console.log('buy len:',buy_hist.length);
  let my_buy_length;
  let my_sell_length;
  let my_buy = [];
  if(buy_hist){
    console.log('!buy_hist');
    for(let idx in buy_hist){
      let buy_product_info = await model['product_info'].findAll({
        where: {
          product_id : buy_hist[idx].product_id,
        },
        raw:true,
      });
      my_buy[idx] = buy_product_info[0];
      my_buy[idx].bid_price = buy_hist[idx].bid_price;
    }
    my_buy_length = my_buy.length;
    my_sell_length = my_sell.length;
  }
  else{
    my_buy = null;
    my_buy_length = 0;
    my_sell_length = 0;
  }
  //console.log('buy len : ', my_buy_length);
  //console.log('sell len : ', my_sell_length);

  //console.log(my_info);
  //console.log('mysell: ',my_sell);
  //console.log('mybuy: ',my_buy);
  res.render("users/my_tradeInfo.html" , { 
    my_info : my_info,
    my_sell : my_sell,
    my_buy : my_buy,
    my_sell_length : my_sell_length,
    my_buy_length : my_buy_length,
    session : session,
  });
});

router.get('/login', function(req, res, next) {
  let session = req.session;

  res.render("users/login.html", { session : session });
});

router.post('/login',async (req,res,next)=>{
  try{
    let body = req.body;
    let session = req.session;

    let result = await model['member_info'].findOne({
      where: {
        id : body.id
      }
    });

    // let dbPassword = result.dataValues.password;
    // let inputPassword = body.password;
    // let salt = result.dataValues.salt;
    // let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

    if(result == null)
    {
      session.message = "wrong_id";
      console.log("잘못된 정보");
      res.render("users/login.html", { session : session });
    }
    else if(result.password == body.pwd)
    {
      console.log("비밀번호 일치");
      req.session.user = {
        "id" : result.id,
        "pw" : result.password
      };
      console.log(req.session.user);
      //res.send("로그인 성공");
      res.redirect("/");
    }
    else
    {
      session.message = "wrong_pw";
      console.log("로그인 실패");
      res.render("users/login.html", { session : session });
    }

  }catch(err){
    console.log(err);
    next(err);
  }
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.clearCookie('sid');

  res.redirect("/");
});

router.post('/logout',async (req,res,next)=>{
  let session = req.session;

  req.session.destroy();
  res.clearCookie('sid');

  res.redirect("/")
});

router.get('/register', function(req, res, next) {

  res.render("users/register.html");
});

router.post('/register',async (req,res,next)=>{
  try{
    let body = req.body;

    let inputPassword = body.user_pw;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

    console.log(body);

    await model['member_info'].create({
      // title : body.postTitle,
      // author : body.author
      id: body.user_id,
      password: body.user_pw,
      address: body.zip_code + "/" + body.addr1 + "/" + body.addr2,
      rank: 0,
      phone_num: body.user_phone_num,
      interest_spon: null,
      private_account: body.user_account,
      amount_donate: 0,
      name : body.user_name,
      nickname : body.user_nickname,
      //salt : salt
    });
    res.redirect('/users/login');
  }catch(err){
    console.log(err);
    next(err);
  }
});

router.post('/dup_check',async (req,res,next)=>{
  var data = req.body.id;

  console.log(data)

  try{

    let result = await model['member_info'].findOne({
      where: {
        id : data
      }
    });

    if(result == null)
    {
      res.json( { data : 'pass' })
    }
    else
    {
      res.json( { data : 'fail' })
    }
  }catch(err){
    console.log(err);
    next(err);
  }
});

router.get('/find_id', function(req, res, next) {
  let session = req.session;

  res.render("users/find_id.html", { session : session });
});

router.post('/find_id',async (req,res,next)=>{
  try{
    let body = req.body;

    let result = await model['member_info'].findOne({
      where: {
        phone_num : body.user_phone_num
      }
    });

    // let dbPassword = result.dataValues.password;
    // let inputPassword = body.password;
    // let salt = result.dataValues.salt;
    // let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

    if(result == null)
    {
      console.log("잘못된 정보");
      res.redirect("/users/find_id");
    }
    else if(result.phone_num == body.user_phone_num)
    {
      console.log("정보 일치");
      res.send(result);
      //res.redirect("/");
    }
    else
    {
      console.log("로그인 실패");
      res.redirect("/users/find_id");
    }

  }catch(err){
    console.log(err);
    next(err);
  }
});

router.get('/find_passwd', function(req, res, next) {
  let session = req.session;

  res.render("users/find_passwd.html", { session : session });
});

router.post('/find_passwd',async (req,res,next)=>{
  try{
    let body = req.body;

    let result = await model['member_info'].findOne({
      where: {
        id : body.user_id,
        phone_num : body.user_phone_num
      }
    });

    // let dbPassword = result.dataValues.password;
    // let inputPassword = body.password;
    // let salt = result.dataValues.salt;
    // let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    if(result == null)
    {
      console.log("잘못된 정보");
      res.redirect("/users/find_passwd");
    }
    else if(result.phone_num == body.user_phone_num &&
    result.id == body.user_id)
    {
      console.log("정보 일치");
      res.send(result);
      //res.redirect("/");
    }
    else
    {
      console.log("로그인 실패");
      res.redirect("/users/find_passwd");
    }

  }catch(err){
    console.log(err);
    next(err);
  }
});

router.get('/my_info', function(req, res, next) {
  let session = req.session;

  res.render("users/my_info.html", { session : session});
});

router.get('/provision1', function(req, res, next) {
  let session = req.session;

  res.render("users/provision1.html", { session : session});
});

router.get('/provision2', function(req, res, next) {
  let session = req.session;

  res.render("users/provision2.html", { session : session});
});


router.get('/findAllUsers', async(req, res, next) =>{
  try{
    const users = await model['member_info'].findAll();
    //res.render('userManager', {users});
    res.send(users);
  } catch(error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
