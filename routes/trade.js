var express = require('express');
var router = express.Router();

//추가
//사진 담기, 파일읽기, 경로설정
var model = require('../models/index');
var multer = require('multer');
const fs = require('fs');
const path = require('path');

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

router.get('/item', function(req, res, next) {
    let session = req.session;

    res.render('trade/item.html', { session : session });
});

router.get('/item_list', async(req, res, next) =>{
    try {
        let session = req.session;
        const product = await model['product_info'].findAll({
            //order: 'createdAt DESC',
            //attributes:['product_picture'],
            raw: true
        });
        console.log('product: ', product.length);
        let product_ = null;
        console.log('ppic: ',product_);
        if(product[0] !== undefined){
            console.log('if문 안');
            product_ = product;
        }
        
        res.render('trade/item_list.html', {
          title: '게시판 리스트',
          rows: product_,
          session : session,
          //productPic : 'uploads/fig.LinkState1607002337230.png'
        });
      } catch (err) {
        console.error(err);
        next(err);
      }
    //res.render('trade/item_list.html', {title: '게시판 리스트', rows: product, session:session});
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

module.exports = router;