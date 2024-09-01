// require('dotenv').config({path:"./env"})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({ path: "./env" });

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.error("Error: ", error);
    })
    app.listen(process.env.PORT || 8000, ()=>{
        `Server is running at port ${process.env.PORT}`
    } )
})
.catch((error)=>{
    console.error("MongoDB connection failed !", error);
})