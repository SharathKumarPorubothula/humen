import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

var connect=async()=>{
try{
    await mongoose.connect(`mongodb+srv://psharathkumar21:psharathkumar21@cluster0.bhhjk4i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    console.log("mongodb is connected")
}
catch(error){
console.log('mongodb error')
}
}

export default connect