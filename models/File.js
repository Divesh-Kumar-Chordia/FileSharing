const mongoose =require("mongoose")

const File =new mongoose.Schema({
  path:{
    type: String,
    required:true
  },
  originalName:{
  type:String

},
password:String,
downloadCount:{
  type:Number,
  required:true,
  default:0
}
});
//location and table style
module.exports =mongoose.model("File",File);
