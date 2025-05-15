//deconstructing user.js route
const User=require("../models/user");

//renderSignUpForm
module.exports.renderSignUpForm=(req,res)=>{
    res.render("./user/signup.ejs");
}

//signUp
module.exports.signUp=async(req,res)=>{
  try{
    let {username,email,password}=req.body;
    const newUser= new User({username,email});
    const registeredUser=await User.register(newUser,password);
    //after the signup the user should be loggedin automatically
    req.login(registeredUser,(err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","welcome to the WonderLust");
      res.redirect("/listings");
    })
   
  }catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
  }

};
//renderLoginForm
module.exports.renderLoginForm=(req,res)=>{
    res.render("./user/login.ejs");
};
//login
module.exports.login=async(req,res)=>{
  req.flash("success","welcome back to WonderLust!");
  const redirectUrl=res.locals.redirectUrl||"/listings";
  res.redirect(redirectUrl);
};
//logout
module.exports.logout=(req, res, next) => {
  req.logout((err) => {
      if (err) {return next(err)};
      req.flash("success", "You are logged out!");
      res.redirect("/listings");
  });
};