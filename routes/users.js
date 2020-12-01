var express = require('express');
var router = express.Router();
var model = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("user/my_info.html");
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


    if(result.password == body.pw)
    {
      console.log("비밀번호 일치");
      res.cookie("user", body.id , {
        expires : new Date(Date.now() + 900000),
        httpOnly : true
      })
      res.send("로그인 성공");
    }
    else
    {
      console.log("로그인 실패");
      res.redirect("/");
    }

  }catch(err){
    console.log(err);
    next(err);
  }
});

router.get('/register', function(req, res, next) {
  res.render("users/register.html");
});

router.get('/find_id', function(req, res, next) {
  res.render("users/find_id.html");
});

router.get('/find_passwd', function(req, res, next) {
  res.render("users/find_passwd.html");
});

router.get('/my_info', function(req, res, next) {
  res.render("users/my_info.html");
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
