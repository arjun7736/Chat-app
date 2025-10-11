import jwt from "jsonwebtoken";
import UserDB from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute =async (req,res,next) => {
  try {
    const token = req.cookies.jwt
    if(!token){
        return res.status(401).json({message:"Unotherized"})
    }
    const decoded = jwt.verify(token,ENV.JWT_SECRET)

     if(!decoded){
        return res.status(403).json({message:"Invalied Token"})
    }
    const user =await UserDB.findById(decoded.userId).select("-password")

    if(!user){
        return res.status(500).json({message:"unexpected error occured"})
    }

    req.user =user
    next()
  } catch (error) {
    console.error(error);
     res.status(500).json({message:"Internal Server Error"})
  }
};
