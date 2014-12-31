/**
 *
 * Created by yh on 14-12-10.
 */

var weiXin=require('./WeiXin'),
express = require('express'),
bodyParser = require('body-parser'),
    multer = require('multer'),
errorHandler = require('errorhandler'),
    iconv=require('iconv-lite'),
    urlencode=require('urlencode');
iconv.extendNodeEncodings();
router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(multer());
router.post('/',function(req,res){
    var data=req.body;
    delete req.body.file;
    delete req.body._id;
    var wx=new weiXin({'name':req.body.typename,'typeId':req.body.cardType});
    wx.save(data,function(err){
        if(err){
            console.log(err);
            res.set("refresh","2;url=/admin");
            res.end("操作失败，2秒后跳转")
        }else{
            res.set("refresh","2;url=/admin");
            res.end("操作成功，2秒后跳转");

        }
    })
})
router.post('/getJson',function(req,res){
    var wx=weiXin.getJson(function(err,doc){
        if(err){
            res.status('800').send();
        }else{
            res.send(doc);
           // res.end();
        }
    })
})
router.post('/getCode',function(req,res){
        weiXin.getCode(req.body.keyword,function(err,doc){
            if(err){
                res.status('800').send();
            }else{
                res.json(doc);
            }
        })
})
router.post('/search',function(req,res){
    var key=req.body.keyword;
        weiXin.search(key,function(err,doc){
            if(err){
                res.status('800').send();
            }else{
                //res.headersSent();
                res.json(doc);
            }
        })

})
module.exports=router;
