var express = require('express');
var router = express.Router();
var model = require('../models/index');

router.get('/notice', async function(req, res, next) {
    var page = req.query.page;
    let session = req.session;

    if(page == undefined)
        page = 1;
    console.log(page);
    var length = 0;
    try {
        const notice_board = await model['notice_board'].findAll({
            raw: true
        });
        console.log(notice_board);
        let notice_board_ = null;
        if(notice_board[0] !== undefined){
            notice_board_ = notice_board;
            length = notice_board.length -1;
        }
        //console.log(notice_board_);

        for(index in notice_board_) {
            let timezoneOffset = new Date().getTimezoneOffset() * 60000;
            let timezoneDate = new Date(notice_board_[index].createdAt - timezoneOffset);
            let date = timezoneDate.toISOString().
            replace(/T/, ' ').
            replace(/\..+/, '');

            console.log(date);

            notice_board_[index].uptime = date;
        }


        res.render('notice/notice.html', {
            title: '게시판 리스트',
            notice_info: notice_board_,
            page : page,
            length : length,
            //page_num : 8,
            pass : true,
            session : session,
        });
        
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//게시글 작성후 post받는곳
router.post('/notice', async (req,res,next)=>{
    let body = req.body;
    console.log('!!!!!!!!!!!!!!!\n',body);

    try {
    const post = await model['notice_board'].create({
        title: body.title,
        description: body.content,
    });
    res.redirect('/notice/notice');
  } catch (error) {
    console.error(error);
    next(error);
  }

});

router.get('/notice_detail', async function(req, res, next) {
    let session = req.session;
    const query_noticeID = req.query.notice_id;
    let notice_info;
    console.log('notice query: ', query_noticeID);
    try {
        notice_info = await model['notice_board'].findOne({
            where : {
                notice_id : query_noticeID
            },
            raw: true,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
    console.log('notice_info : ', notice_info);
    res.render('notice/notice_detail.html', { 
        notice_info : notice_info, 
        session : session 
    });
});

router.get('/write_notice', function(req, res, next) {
    let session = req.session;

    res.render('notice/write_notice.html', { session: session });
});

module.exports = router;