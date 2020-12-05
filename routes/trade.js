var express = require('express');
var router = express.Router();

//추가
//사진 담기, 파일읽기, 경로설정
var model = require('../models/index');
var multer = require('multer');
const fs = require('fs');
const path = require('path');

//Query문
const { QueryTypes } = require('sequelize');

try {//폴더 읽기, 없으면 생성
    fs.readdirSync('public/uploads');
  } catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('public/uploads');
  }

const upload = multer({
    storage: multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
    }),
    limits: { fileSize: 25 * 1024 * 1024 },
});

//이미지 미리보기
router.post('/upload_item/img',upload.single('img'), (req, res) => {
    console.log('upload/img!!!\n',req.file);
    res.json({ url: `/uploads/${req.file.filename}` });
});

//판매 db등록
const upload2 = multer();

router.post('/logout',async (req,res,next)=>{
    let session = req.session;

    req.session.destroy();
    res.clearCookie('sid');

    res.redirect("/")
});

router.post('/upload_item', upload2.none(), async (req, res, next) => {

    let body = req.body;
    console.log('!!!!!!!!!!!!!!!\n',body);

    let get_info;

    try {
        get_info = await model['member_info'].findOne({
            where : {
                id : body.user_id
            }
        });
    } catch (error) {
        console.error(error);
        next(error);
    }

    try {
    const post = await model['product_info'].create({
      //product_id : 7, ==>자동증가됨
      seller_id: get_info.id,
      product_describe: body.message,
      start_price: body.start_price,
      phone_num: get_info.phone_num,
      interest_spon: body.done_percentage,
      product_picture: body.url,
      duration: body.auction_time,
      title: body.title,
    });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/upload_item', function(req, res, next) {
    let session = req.session;

    if(session.user === undefined)
    {
        session.loginAlert = true;
        res.redirect("/users/login")
    }

    res.render('trade/upload_item.html' , { session : session});
});

router.get('/item_list', async(req, res, next) =>{

    var page = req.query.page;
    let session = req.session;

    if(page == undefined)
        page = 1;
    console.log(page);

    try {
        const product = await model['product_info'].findAll({
            //order: 'createdAt DESC',
            //attributes:['product_picture'],
            raw: true
        });
        let product_ = null;
        if(product[0] !== undefined){
            product_ = product;
        }

        res.render('trade/item_list.html', {
            title: '게시판 리스트',
            rows: product_,
            page : page,
            length : product_.length - 1,
            page_num : 8,
            pass : true,
            session : session,
        });
        console.log(product_.length - 1, '/', page);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/item', async (req, res, next) =>{
    let session = req.session;
    const query_productID = req.query.product_id;
    let product_info;
    let seller_info;
    let bid_hist;
    let last_bid;
    let last_bid2;
    console.log('item query: ', query_productID);
    try {
        product_info = await model['product_info'].findOne({
            where : {
                product_id : query_productID
            },
            raw: true,
        });
        
        let sellerId = product_info['seller_id'];
        let productId = product_info['product_id']
        console.log('product_info : ', product_info);
        //console.log('product_info.interest : ', product_info['interest_spon']);
        console.log('seller_id : ', sellerId);
        
        seller_info = await model['member_info'].findOne({
            where : {
                id : sellerId,
            },
            raw: true,
        });

        // bid_hist = await model['bid_history'].findOne({
        //     where : {
        //         product_id : productId,
        //     },
        //     raw: true,
        // });
        let sqlQuery = `select * from bid_histories bh where bh.product_id = ${productId} having bh.order= (select max(bid_histories.order) from bid_histories);`;
        //console.log('sqlquery: ', sqlQuery.toString());
        //"Select * from bid_histories where bid_histories.product_id = 1 having bid_histories.order= (select max(bid_histories.order) from bid_histories);"
        last_bid = await model.sequelize.query(sqlQuery,{
            type:QueryTypes.SELECT,
            raws: true,
          });
          //JSON.stringify(last_bid)
        console.log('last_bid : \n',last_bid[0]);
        // bid_hist = await model['bid_history'].findAll({
        //     attributes:[
        //         [sequelize.fn('max',sequelize.col('order')), 'maxOrder']
        //     ],
        //     where : {
        //         product_id : productId,
        //     },
        //     raw: true,
        // });
        if(last_bid[0] == undefined){
            let startprice = product_info['start_price'];
            console.log('bidhist empty, create bidhist');
            //let cur_time = moment.defaultFormat();
            try{
            bid_hist = await model['bid_history'].create({
                product_id : productId,
                member_id : sellerId,
                bid_price : startprice,
                order : 1,
            });
            }catch(error){
                console.error(error);
                next(error);
            }
            bid_hist = JSON.stringify(bid_hist);
            last_bid2 = JSON.parse(bid_hist);
            console.log('bid_@@@@@@@@:', bid_hist);
        }
        else{
            last_bid2 = last_bid[0];
        }
        console.log('bid_hist : ',bid_hist);
        console.log('after last_bid2 : \n',last_bid2);
    } catch (error) {
        console.error(error);
        next(error);
    }
    console.log('seller_info : ', seller_info);
    res.render('trade/item.html', { 
        product_info : product_info, 
        seller_info : seller_info,
        bid_hist: last_bid2,
        session : session 
    });
});

router.get('/direct_done', function(req, res, next) {
    let session = req.session;

    if(session.user === undefined)
    {
        session.loginAlert = true;
        res.redirect("/users/login")
    }

    res.render('trade/direct_done.html', { session : session});
});

//입찰하기 누른다음
router.post('/trade_finish', async (req,res,next)=>{
    let session = req.session;
    let body = req.body;
    if(session.user === undefined)
    {   
        session.loginAlert = true;
        res.redirect("/users/login")
    }
    console.log('body : \n', body);

    //입찰기록
    try {
        let price = Math.floor(body.bid_price) + 1000;
        console.log('price : ',price);
        let order = Math.floor(body.order) + 1;
        await model['bid_history'].create({
          product_id : body.product_id,
          member_id : session.user.id,
          order : order,
          bid_price: price,
        });
        res.redirect('/');
      } catch (error) {
        console.error(error);
        next(error);
      }
});

module.exports = router;