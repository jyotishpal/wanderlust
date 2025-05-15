//intializing the database 
//inserting the data from here the index.js and then go back to the app.js
//requiring the data
const initData=require("./data.js")
const mongoose=require("mongoose");
main()
.then(()=>{
    console.log("connected succesfully");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}
//requiring the models
const Listing =require("../models/listing.js");

//inserting the data
//making it async inserting the data may take time
const initDB=async()=>{
  //first deleting all old data
 await Listing.deleteMany({});
 //before insertin the data i want to add the owner of Each listing who has crated
 initData.data= initData.data.map((obj)=>({...obj,owner:'6813260a09d379ce0307b42a'}));
  //now inserting the all data
 await Listing.insertMany(initData.data);
  console.log("database is intialized");
}
initDB();