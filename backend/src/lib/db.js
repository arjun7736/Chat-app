import mongoose from "mongoose"
import { ENV } from "./env.js";

export const connectDB =async ()=>{
    try {
        if(!ENV.MONGO_URI){
            throw new Error("MONGO uri Missing")
        }
        await mongoose.connect(ENV.MONGO_URI)
        console.log("DB connected");
    } catch (error) {
        console.error("DB not connected");
        process.exit(1)
    }
}