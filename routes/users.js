var express = require('express');
var router = express.Router();
var model = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("user/my_info.html");
});

router.get('/login', function(req, res, next) {
  res.render("user/login.html");
});

router.get('/register', function(req, res, next) {
  res.render("user/register.html");
});

router.get('/find_id', function(req, res, next) {
  res.render("user/find_id.html");
});

router.get('/find_passwd', function(req, res, next) {
  res.render("user/find_passwd.html");
});

router.get('/my_info', function(req, res, next) {
  res.render("user/my_info.html");
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
