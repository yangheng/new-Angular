/**
 *
 * Created by yh on 14-12-9.
 */

var mongoose=require('mongoose');
    function Database(){
        this.db=mongoose.connect('mongodb://localhost/nodejs');
        this.mongo=mongoose
    }
module.exports=new Database();