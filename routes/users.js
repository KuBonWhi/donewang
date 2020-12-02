var express = require('express');
var router = express.Router();
var model = require('../models');
const crypto = require('crypto'); // 암호화에 필요한 API

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("users/my_info.html");
});

router.get('/login', function(req, res, next) {
  let session = req.session;

  res.render("users/login.html", {
    session : session
  });
});

router.post('/login',async (req,res,next)=>{
  try{
    let body = req.body;

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
      console.log("잘못된 정보");
      res.redirect("/users/login");
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
      console.log("로그인 실패");
      res.redirect("/users/login");
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
      rank: null,
      phone_num: body.user_phone_num,
      interest_spon: null,
      private_account: null,
      amount_donate: null
      //salt : salt
    });
    res.redirect('/');
  }catch(err){
    console.log(err);
    next(err);
  }
});

router.get('/find_id', function(req, res, next) {
  res.render("users/find_id.html");
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
  res.render("users/find_passwd.html");
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
  res.render("users/my_info.html");
});

router.get('/provision1', function(req, res, next) {
  res.render("users/provision1.html");
});

router.get('/provision2', function(req, res, next) {
  res.render("users/provision2.html");
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
