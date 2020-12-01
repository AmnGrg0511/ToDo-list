const express= require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");

const app=express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-Aman:Aman1234@cluster0.3lmrc.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.set('useFindAndModify', false);
const itemsSchema={
  name:String
};

const Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
  name:"Welcome to your To-Do list"
});

const item2=new Item({
  name:"Hit the + to add an Item"
});

const item3=new Item({
  name:"Check it out to remove"
});

let ditems=[item1,item2,item3];

const listSchema={
  name: String,
  items:[itemsSchema]
};

const List=mongoose.model("List",listSchema);

var today=new Date();
option={
  weekday: "long",
  day: "numeric",
  month: "long"
}
today=today.toLocaleDateString("en-UK",option);

let flag=true;

app.get("/",function(req,res){
  Item.find({},function(err,foundItems){
    if(foundItems.length==0&&flag){
      Item.insertMany(ditems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Success!");
        }
      });
      res.redirect("/");
    }
    else{
      res.render("list",{day:today ,newItems:foundItems});
    }
    flag=true;
  });
});

app.post("/remake",(req,res)=>{
  Item.deleteMany({},(err)=>{
    console.log(err);
  });
  flag=false;
  res.redirect("/");
});

app.get("/:customList",(req,res)=>{
  const customName=_.capitalize(req.params.customList);
  List.findOne({name:customName},(err,foundList)=>{
    if(!err){
      if(foundList){
        res.render("list",{day:customName,newItems:foundList.items});
      }
      else{
        const list=new List({
          name:customName,
          items:ditems
        });
        list.save();
        res.redirect("/"+customName);
      }
    }
  })


});

app.post("/",(req,res)=>{
  const itemName=req.body.newData;
  const list=req.body.list;
  const item=new Item({
    name:itemName
  });
  if(list===today){
    item.save();
    res.redirect("/");
  }
  else{
    List.findOne({name:list},(err,foundList)=>{
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+list);
    });
  }
});

app.post("/delete",(req,res)=>{
  const list=req.body.list;
  if(list===today){
    Item.findByIdAndDelete(req.body.Check,(err)=>{
      console.log(err);
    });
    res.redirect("/");
  }
  else{
    List.findOneAndUpdate(
      {name:list},
      {$pull:{items:{_id:req.body.Check}}},
      (err,foundList)=>{
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/"+list);
      }
    })
  }
})

app .listen(process.env.PORT || 3000,()=>{
  console.log("listening to port 3000");
})
