const express= require("express");
const bodyParser=require("body-parser");

const app=express();
var items=[];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  var today=new Date();
  items=[];
  option={
    weekday: "long",
    day: "numeric",
    month: "long"
  }
  today=today.toLocaleDateString("en-UK",option);
  res.render("list",{day:today ,newItems:items});
});

app.get("/updated",function(req,res){
  var today=new Date();
  option={
    weekday: "long",
    day: "numeric",
    month: "long"
  }
  today=today.toLocaleDateString("en-UK",option);
  res.render("list",{day:today ,newItems:items});
});

app.post("/",(req,res)=>{
  res.redirect("/");
});

app.post("/update",(req,res)=>{
  item=req.body.newData;
  items.push(item);
  res.redirect("/updated");
});

app .listen(process.env.PORT || 3000,()=>{
  console.log("listening to port 3000");
})
