const express=require("express");
const router=express.Router({mergeParams:true});
const {validateReview,isLoggedIn}=require("../middleware.js");

//here are the /listings/:id/reviews is removed beacause it is given in app.js parent route

//requring all of those things which are used in routes like wrapasync etc

//requiring the listingschema for the serverside validation
const {listingSchema,reviewSchema}=require("../schema.js");

//requiring the wrapAsync
const wrapAsync=require("../utils/wrapAsync.js");

//requiring the ExpressError
const ExpressError=require("../utils/ExpressError.js");

//requiring mongoose for models
const Listing=require("../models/listing.js");

//requiring  review models
const Review=require("../models/review.js");




//now accessing all the reviews route from the app.js
//router will change with router object both have the express method


//requiring controller review.js
const reviewController=require("../controllers/review.js");
//creating route for review
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//creating route for deleting the review
router.delete("/:reviewId", wrapAsync(reviewController.destroyreview));
//exporting the review.js
module.exports=router;