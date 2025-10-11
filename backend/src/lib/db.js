import mongoose from "mongoose"

export const connectDB =async ()=>{
    try {
        if(!process.env.MONGO_URI){
            throw new Error("MONGO uri Missing")
        }
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected");
    } catch (error) {
        console.error("DB not connected");
        process.exit(1)
    }
}