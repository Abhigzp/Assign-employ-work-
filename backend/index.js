var express = require("express");
var cors = require("cors");
const { ObjectID } = require("bson");
var app = express();
var client = require("mongodb").MongoClient;
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers', 'X-Requested-With,content-type");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials: true")
  next();

});
app.use(express.json());
app.use(cors())

const port  = 3100;
var url = "mongodb://localhost:27017/"
var dbo;
client.connect(url, function(err, res) {
    if (err) throw err;
    console.log("connected vhghgghjjh");
     dbo = res.db("workdepartment");
    dbo.collection("username");
    dbo.collection("work");
    // res.close();
  });

app.get("/get-data", async (req,res)=>{
   
  // let data = await dbo.collection("username").find({})
  // if(data){
  //   res.send(data);
  // }
  const data =await dbo.collection("username").find({}).toArray(function(err, result){
       if(err) throw err;
      //  console.log(result);
       res.send(result);
   });

})

// 2nd Api for work ASSIGN 
app.get("/get-datawork", async (req,res)=>{
  const data1 =await dbo.collection("work").find({}).toArray(function(err, result){
    if(err) throw err;
     //  console.log(result);
    res.send(result);
  });
})

app.post("/post-data",(req,res)=>{
   let body = req.body;
   console.log(body);
   dbo.collection("userTaskInfo").find({name:body.name}).toArray(function(err,resp){
     if(err) throw err;
     if(resp.length===0){
      dbo.collection("userTaskInfo").insertOne(body,(err,result)=>{
        if(err) throw err;
        console.log("Successfully inserted");
        console.log(result);
        
        res.send("");
    });
     }
   })

})
// this Api is used for get data from id to Ui div
app.get("/user-data/:name",(req,res)=>{    
  // let body = req.body;
  let name = req.params.name
  // console.log(body);
  dbo.collection("userTaskInfo").find({name:name}).toArray(function(err,result){
      if(err) throw err;
      // console.log("Successfully inserted");
      console.log(result);
      
      res.send(result);
  });
})
app.put('/update-data',(req,res)=>{
  let data = req.body;

  let myquery ={name:data.name}
  let newValue = {$set:{task:data.task}}
  const options = { returnNewDocument: true };
  dbo.collection('userTaskInfo').findOneAndUpdate(myquery,newValue,options,(err,result)=>{
    if(err) throw err
    console.log(result)
  });
  res.status(200).send('Update')
})


// app.delete("/delete/:id",  (req, res) => {
//   let id =ObjectID(req.params.id)
//   console.log(id)
//   dbo.collection("todoList").deleteOne({_id:id},(err,result)=>{
//     if(err) throw err
//     console.log(result)
//     res.status(200).send('record deleted')
//   });
  
// });
  
app.listen(port, ()=>console.log(`Server is Live at ${port}`))
