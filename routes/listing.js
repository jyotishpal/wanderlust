

const express=require("express");
const router=express.Router({mergeParams:true});
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");



//here are the /listings is removed beacause it is given in app.js parent route

//requring all of those things which are used in routes like wrapasync etc


//requiring the wrapAsync
const wrapAsync=require("../utils/wrapAsync.js");


//requiring mongoose for models
const Listing=require("../models/listing.js");





//now accessing all the listing route from the app.js
//router will change with router object both have the express method

//requiring listing controller
const listingController = require("../controllers/listing.js");
const { render } = require("ejs");

//requring multer
const multer  = require('multer')
//requring storage from cloudconfig.js
const{storage}=require("../cloudConfig.js")
const upload = multer({storage});//now multer will store on storage on cloudinary


//creating index route /listings to show all data
//and
//creating post request to add
//try and catch to handle the error
//router.route() is used for same route to optimised the code
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
//it use the req.file instead of req.body  upload.single('listing[image]')

//creating a new route to get request and open a form and at submit it take post request and create new list
router.get("/new",isLoggedIn,listingController.renderNewForm);





// creating the show route to show all details on agiven id /listings/:id
//and
//after edited that updated will show
//and
//to delete this listing
//router.route() is used for same route to optimised the code

router.route("/:id")
.get(wrapAsync(listingController.showListing))
//upload.single('listing[image]') to update the new image
.put(isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isOwner,isLoggedIn,wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isOwner,isLoggedIn,wrapAsync(listingController.renderEditForm));


//logout user
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
});

//exporting the listing.js
module.exports=router;