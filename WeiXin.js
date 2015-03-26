/**
 * Created by yh on 14-8-25.
 */
/*添加公众号*/
    var db=require('./db'),
        http=require('http')
        iconv=require('iconv-lite'),
        urlencode=require('urlencode'),
        Bufferhelper=require('bufferhelper'),
        cheerio=require('cheerio');
        iconv.extendNodeEncodings();
    function WeiXin(model){
        this.typeId=model.typeId;
        this.typeName=model.name;
    }
    WeiXin.CardSchema=new db.mongo.Schema({
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
    WeiXin.CardType=new db.mongo.Schema({
        'typeId':String,
        'typeName':String,
        'cards':[WeiXin.CardSchema]
    })
    WeiXin.prototype.save=function(data,callback){
         var that=this,
             CardModel=db.mongo.model('CardModel',WeiXin.CardType),
             pro=CardModel.where({'typeName':that.typeName}).findOne().exec();
             pro.then(function(doc){
                if(doc){
                   // card=new CardModel(doc);
                    doc.cards.push(data);
                    doc.save(function(err){
                        callback(err);
                    })
                }else{
                    var card=new CardModel;
                    card.typeId=that.typeId;
                    card.typeName=that.typeName;
                    card.cards.push(data);
                    card.save(function(err){
                         callback(err);
                    })
                }
            },function(err){
                 callback(err);
            })

    }
    WeiXin.getJson=function(callback){
        var CardModel=db.mongo.model('cardmodals',WeiXin.CardSchema),
            pro=CardModel.find().exec();
        pro.then(function(doc){
           callback(undefined,doc);
        },function(err){
            callback(err);
        })
    }
    WeiXin.search=function(word,callback){

        var remoteData='',codeType;
        var url='http://www.weixinju.com/index.php?m=content&c=weixinju&a=search&word='+urlencode(word, 'gbk');
        http.get(url,function(res){
            //res.setEncoding('gbk');
            //console.log(res.headers);
            var buffer=new Bufferhelper();
            codeType=res.headers['content-type'].match(/charset=(\S+)$/)[1];
            var buffers=[],size= 0,remoteData='';


            res.on('data',function(chunk){
                buffer.concat(chunk);
                //remoteData+=chunk;
                 //buffers.push(chunk)
                //size+=chunk.length;
            })
            res.on('end',function(){
               /* var buffer=new Buffer(size),pos=0;
                for(var i = 0, l = buffers.length; i < l; i++){
                        buffers[i].copy(buffer,pos);
                        pos+=buffers[i].length;
                }*/
                //返回值
                var data=[];
                var str = iconv.decode(buffer.toBuffer(),codeType);
                    var $=cheerio.load(str),content=$('.filter-app-list').children('li');
                    if(content.length==0){

                    }else{
                        content.each(function(index,elem){
                            var obj={},img=$(this).find('img');
                            obj.title=img.attr('alt');
                            obj.pic=img.attr('src');
                            obj.href=$(this).find('a').eq(0).attr('href');
                            obj.detail=$(this).find('.detail').text();
                            data.push(obj);
                        })
                    }

                //var decodedBody = iconv.decode(Buffer.concat(buffers), codeType);

                callback(undefined,data)
            })

        }).on('error',function(e){
                callback(e);
            })
    }

    WeiXin.getCode=function(path,callback){
        var remoteData={},codeType;
        var url='http://www.weixinju.com'+path;
        console.log(url);
        http.get(url,function(res){
            var buffer=new Bufferhelper();
            res.on('data',function(chunk){
                buffer.concat(chunk);
            })
            res.on('end',function(){
                var data=[];
                var str = iconv.decode(buffer.toBuffer(),'GBK');
                var $=cheerio.load(str),pic=$('.piccode').find('img').attr('src');
                console.log("pic:"+pic);
                remoteData.code=pic;
                callback(undefined,remoteData)
            })

        }).on('error',function(e){
                callback(e);
            })
    }
    module.exports=WeiXin;



