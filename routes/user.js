const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");



//rquireing user.js controllers
const userController=require("../controllers/user.js");

//router. get method to
router.route("/signup")
 .get(userController.renderSignUpForm)

 .post(wrapAsync(userController.signUp));

//now routes for the login
router.route("/login")
.get(userController.renderLoginForm)
//here we use the middleware in which passport.authenticate which 
//authenticate the user 
//savedRedirectUrl for redircting on correct page
.post(savedRedirectUrl,
    passport.authenticate('local',{failureRedirect:"/login",
        failureFlash:true,

}),
userController.login);

//logout user
router.get("/logout", userController.logout);
module.exports=router;