const express =require("express");
const app =express();
app.use(express.urlencoded({extended:true}));
const multer =require("multer");
require("dotenv").config();
const mongoose =require("mongoose");
const upload =multer({dest:"uploads"});
const bcrypt  =require("bcrypt");
//calling a function from dotenv library
const File = require("./models/File");

mongoose.connect(process.env.DATABASE_URL);
//setting the engine
//create a new folder view
app.set("view engine","ejs");

app.get("/",function(req,res){
  res.render("index")

});
app.post("/upload",upload.single("file"),async(req,res) =>{
  const fileData={
    path:req.file.path,
    originalName:req.file.originalName,
  }
  //password is not handeled by multer rather express
  if(req.body.password!=null && req.body.password!==""){
    fileData.password = await bcrypt.hash(req.body.password,10);
  }//hashing the password
  const file = await File.create(fileData);
  console.log(file);
  res.render("index",{fileLink:`${req.headers.origin}/file/${file.id}`})
})
app.route("/file/:id").get(handleDownload).post(handleDownload);




async function handleDownload(req,res){
  //downloading the file
  const file =await File.findById(req.params.id)
  if(file.password !=null)
  {
    if(req.body.password==null){
      res.render("password");
      return;
    }//goes to password page and we get the password now we compare
    if(!(await bcrypt.compare(req.body.password,file.password))){
      res.render("password",{error:true})
      return
    }
  }
  file.downloadCount++;
  await file.save()
  console.log(file.downloadCount)
  res.download(file.path,file.orginalName)
}
app.listen(process.env.PORT);
