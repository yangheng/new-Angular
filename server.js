/**
 * Created by yh on 14-8-20.
 */
var express=require("express"),
    path=require('path'),
    favicon = require('serve-favicon')
    methodOverride = require('method-override'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    db=require('./db'),
    multer = require('multer'),
    logger = require('morgan'),
    ejs=require('ejs'),
    errorHandler = require('errorhandler')
    util=require('util'),
    weiXin=require('./WeiXin'),
    migrate=require('./migrate'),
    iconv=require('iconv-lite');
    iconv.extendNodeEncodings();
//db.on('error',console.error.bind(console,'连接错误:'));
var home = express.static(__dirname + '/app');

    Schema=db.mongo.Schema;
    CardSchema=new Schema({
        'cardId':String,
        'cardName':String,
        'cardDes':String,
        'cardCode':String,
        'cardRate':{
            type:Number,
            default:0
        },
        'cardDate':{
            type:Date,
            default:Date.now()
        },
        'cardType':String
    });
    Notice=new Schema({
        'cardId':String,
        'cardName':String,
        'cardDes':String,
        'cardDate':{
            type:Date,
            default:Date.now()
        },
        'cardType':String
    })
    var cardModal=db.mongo.model('cardModal',CardSchema),
        noticeModel=db.mongo.model('noticeModel',Notice),
        Ncount;
    //;
    app=express();
    app.engine('.html', require('ejs').__express);
    app.set('views', __dirname+'/admin');
    app.set('view engine','html');
    app.use('/public',express.static(__dirname+'/public'));
    app.use('/app',express.static(__dirname+'/app'));
    app.use('/bower_components',express.static(__dirname+'/bower_components'));
    app.use('/data',migrate);
    app.use(methodOverride());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(multer());
    app.use(bodyParser.json());
    app.use(logger('dev'));
    //app.use('/edit',weiXin)
    //后台通用数据
    app.use(/\/admin/,function(req,res,next){
        noticeModel.count(function(err,count){
            if(err){
                handleError(err);
            }else{
                console.log("count:"+count);
                Ncount=count; next();
            }

        })

    })
    //后台首页
    app.route('/admin').get(function(req,res){
        var page=req.query.page?req.query.page-1:0, p=cardModal.find().skip(page*10).limit(10).exec();
        var obj={};
        obj.title="后台管理";
        obj.current=page+1;
        obj.total=Ncount;
        p.then(function(card){
                obj.cards=card;
                return cardModal.count().exec();
            }).
            then(function(count){
                obj.count=Math.ceil(count/10);
                res.render('index',obj)
            })
            .end();
    })
    // 查找
    app.route('/admin/search').post(function(req,res){
        var reg=new RegExp(req.body.cardName,'ig'),page=req.body.page?req.body.page-1: 0, p=cardModal.find({cardName:reg}).skip(page*10).limit(10).exec();
        var obj={};
        console.log(req.body.page);
        obj.title="后台管理";
        obj.current=page+1;
        obj.total=Ncount;
        p.then(function(card){
                obj.cards=card;
                return cardModal.find({cardName:reg}).count().exec();
            }).
            then(function(count){
                obj.count=Math.ceil(count/10);
                res.render('index',obj)
            })
            .end();
    })
    //删除
    app.route('/admin/delete/:id?').get(function(req,res){
        cardModal.remove({_id:req.query.id},function(err){
            if(err){
                handleError(err);
                res.render('result',{title:"删除微信号",isErr:true})
            }else{
                res.render('result',{title:'删除微信号',isErr:false});
            }
        })
    })
    //添加
    app.route('/admin/add').get(function(req,res){
        res.render('add',{'title':'添加公众号',path:'add',data:{},'total':Ncount})
    }).post(function(req,res){
         delete req.body.file;
         delete req.body._id;
         var newCard=req.body;
         var Cards=new cardModal(newCard);
            Cards.save(function(err,card,num){
                if(err){
                    res.set("refresh","2;url=/admin/add");
                    res.end("操作失败，2秒后跳转")
                }else{
                  res.set("refresh","2;url=/admin/add");
                  res.end("操作成功，2秒后跳转")

                }
            })

        })

    //编辑
    app.route('/admin/edit').get(function(req,res){
        cardModal.findById(req.query.id,function(err,doc){
            if(err){
                res.set("refresh","2;url=/admin");
                res.end("宝贝获取失败，2秒后跳转")
            }else{
              res.render('add',{title:'编辑公众号',path:'migrate',data:doc,'total':Ncount})
            }
        })
    }).post(function(req,res){
            delete req.body.file;
            var newCard=req.body;
            cardModal.findByIdAndUpdate(req.body._id,newCard,function(err){
                if(err){
                    res.set("refresh","2;url=/admin");
                    res.end("操作失败，2秒后跳转")
                }else{
                    res.set("refresh","2;url=/admin");
                    res.end("操作成功，2秒后跳转");

                }

            });

        })
    Card=function(){

    };
    Card.prototype.addCard=function(json){
        cardModal.creat(json,function(err, jellybean, snickers){
        })
    }
    Card.prototype.getCards=function(){
    }

    app.listen(3000,function(){
        console.log(" http://localhost:3000/ server is open")

    });




