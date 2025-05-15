//to print env
//it can not use in production level
if(process.env.NODE_ENV !="production"){
require('dotenv').config()
}
// Rquiring the express for writing the api
const express=require("express");
const app=express();
//setting path
const path=require("path");

//requiring passport
const passport=require("passport");
const LocalStartegy=require("passport-local");
//now requiring the user model
const User=require("./models/user.js");
// const mongoose_url="mongodb://127.0.0.1:27017/wonderlust";
const dbUrl=process.env.ATLASDB_URL;
//reuireing session
const session=require('express-session');
//for stroing session online while doing production
const MongoStore = require('connect-mongo');

//creating option with MongoStore
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
    secret: "process.env.SECRET",
  },
   touchAfter: 24 * 3600, // time period in seconds automatically restore the in 24 hours
})
store.on("error",()=>{
    console.log("Error have been occured from monago cnnect",err)
})
//creating option
const sessionOption={
    store,
    secret:"process.env.SECRET",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}
//midleware to use express session
app.use(session(sessionOption));

//requiring connect-flash to popup msg for one time and then remove
const flash = require('connect-flash');
app.use(flash());

//passport always intializes after the sessions
app.use(passport.initialize());
app.use(passport.session());
//now using the authenticate method to vrify user
//as we are using the passport-local
passport.use(new LocalStartegy(User.authenticate()));
//to store the user related info in session in srial called srealizable
passport.serializeUser(User.serializeUser());
//after the logout of the user to unstore the user related info in session in srial called desrealizable
passport.deserializeUser(User.deserializeUser());


//creating a demoUser 
// app.get("/demouser",async(req,res)=>{
//     let fakeUser= new User({
//         email:"student@gmail.com",
//         username:"jyotish",
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

//cors is a npm package that is used to send the req on our api from the cross origin
const cors = require("cors");
app.use(cors());

//requiring the listingschema for the serverside validation
const {listingSchema,reviewSchema}=require("./schema.js");


//requiring ejs
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//requiring the wrapAsync
const wrapAsync=require("./utils/wrapAsync.js");

//requiring the ExpressError
const ExpressError=require("./utils/ExpressError.js");

//requiring ejs-mate for templating
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);

//requiring the public folder
app.use(express.static(path.join(__dirname,"/public")));


// to parse all the requested data
app.use(express.urlencoded({extended :true}))

//requiring method_override
const methodOverride=require("method-override");
app.use(methodOverride("_method"));

//requiring mongoose for models
const Listing=require("./models/listing.js");

//requiring  review models
const Review=require("./models/review.js");


//Requiring mongoose for to connect database in javascript
const mongoose=require("mongoose");


main().then(()=>{
    console.log("connected succesfully");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(dbUrl);//connect is method 
     //of mongoose having the then and catch method.                                                             
}


//inserting somedata into database
// app.get("/testListing",async(req,res)=>{
//     let sampleList=new Listing({
//         title:"my new villa",
//         description:"By the beach",
//         price:1200,
//         location:"calangute,Goa",
//         country:"india",
//     })
//     await sampleList.save();
//     console.log("sample is saved");
//     res.send("testing is succesfull");

// })

//schema validation error middleware
const validateListing=(req,res,next)=>{
   let{error}=listingSchema.validate(req.body);
   if(error){
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
    
   }else{
    next();
   }
};

//validating the review schema
const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
        
    }else{
     next();
    }
 };
  // first requiring the listing.js and review.js routes
  const listingsRouter=require("./routes/listing.js");
  const reviewsRouter=require("./routes/review.js");
  const userRouter=require("./routes/user.js");

 //midleware to used flash
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;//store the user info help in login and etc
   
    next();
})



//here all the listing and review route will be executed
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);






//creating the '/' root for verifying
// app.get("/",(req,res)=>{
//     res.send("it is working");
// })

//it will work for all not existing route
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
}) 

//error handling midleware
app.use((err,req,res,next)=>{
    let{statuscode=500, message="something went wrong!"}=err;
    res.status(statuscode).render("listings/error.ejs",{message});
})


//Starting the api to a specific port for taking response
let port=8080;
app.listen(port,(req,res)=>{
    console.log(`port is listening on port ${port}`);
});