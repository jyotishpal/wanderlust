//deconstructing review route to controller

//requireing review and listings model
const Listing=require("../models/listing");
const Review=require("../models/review");

//createReview
module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
   
     
     await newReview.save();
    listing.reviews.push(newReview);

     await listing.save();
     
     
     req.flash("success","Reviws created succesfully!");
     res.redirect(`/listings/${listing._id}`);
};

//destroyListing
module.exports.destroyreview=async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Reviws deleted succesfully!");
    res.redirect(`/listings/${id}`);
};