const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

//the username and the password it passportLocalMongoose it will automatically save
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
});
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',userSchema);