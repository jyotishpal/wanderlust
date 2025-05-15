//deconstructing the backend code
const Listing=require("../models/listing");

//lstingin index route
module.exports.index=async(req,res)=>{
    let allListings=await Listing.find();//async await beacuse all mongoose are thenable meathod.
   
    res.render("./listings/index.ejs",{allListings});
   
};

//rendering new form

module.exports.renderNewForm= (req, res) => {
   
    res.render("listings/new.ejs");
    
};

//showListing
module.exports.showListing=async(req,res)=>{
    let { id }=req.params;
  const listing = await Listing.findById(id)
  .populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  })
  .populate('owner');

    //if listing does not exist
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
   
      
    res.render("./listings/show.ejs",{ listing});
};

//createListing  
module.exports.createListing=async(req,res,next)=>{
    //let {title , description,image,country,location}=req.body;
    //above statement can replace by
    // const listing=req.body;
    // console.log(listing);
    //listing gives object of new entered list
    
     

    // //handling error if the listing is not found from the body
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listings");
    // }
    

   
    let newListing=await Listing(req.body.listing);
    //deconstructing filename and url from multer
    const{url,filename}=req.file;
    // ✅ Assign the uploaded image to the listing
    newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
    };
    // adding the owner for listing who is created;
    newListing.owner = req.user._id;
    await newListing.save();
    
   
    //flash
    req.flash("success","listing  created succesfully!");
   
    // console.log(newListing);
    res.redirect("/listings");
   

};

//renderEditForm
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
    
};

//updateListing
module.exports.updateListing=async(req,res)=>{
// //handling error if the listing is not found from the body
// if(!req.body.listing){
//     throw new ExpressError(400,"send valid data for listings");
// }

    //accessing all the data after updating
  let {id}=req.params;
  const listing1=req.body.listing;
  const listing=await Listing.findByIdAndUpdate(id,listing1,{new:true});
   //deconstructing filename and url from multer
   if(typeof req.file !="undefined"){
        let url= req.file.path;
        let filename=req.file.filename;
    
    // ✅ Assign the uploaded image to the listing
    listing.image = {url,filename};
        
    
    await listing.save();
   }
  req.flash("success","listing is edited succesfully!");
  res.redirect(`/listings/${id}`);

};

//destroylisting
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    const deletedListing=await Listing.findByIdAndDelete(id);

    req.flash("success"," listing is deleted succesfully!");
    res.redirect("/listings");
};