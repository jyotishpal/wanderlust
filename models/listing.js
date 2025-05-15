const mongoose=require("mongoose");
//requiring the user model for Owner
const User=require("./user.js");
//requireing the review model for middleware
const Review=require("./review.js")
const Schema=mongoose.Schema;
const listingSchema =new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
    
    },
    
    
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User", 
      },
      

});
//creatiing the middleWare
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});
//creating models
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;