const Listing=require("./models/listing");
//requiring the ExpressError
const ExpressError=require("./utils/ExpressError.js");


//requiring the listingschema for the serverside validation
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must have login before creaing the listings");
        return res.redirect("/login");
    }
    next();
}

//to store  req.session.redirectUrl=req.originalUrl; this in the locals because 
// passport unstore the session once it logged in
module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

//middleware for authorization
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not Owner of this listing");
       return res.redirect(`/listings/${id}`);
    }
    next();
}
//schema validation error middleware
module.exports.validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
     const msg = error.details.map((el) => el.message).join(",");
     throw new ExpressError(400, msg);
     
    }else{
     next();
    }
 };
//validating the review schema
 module.exports.validateReview=(req,res,next)=>{
     let{error}=reviewSchema.validate(req.body);
     if(error){
         const msg = error.details.map((el) => el.message).join(",");
         throw new ExpressError(400, msg);
         
     }else{
      next();
     }
  };
 