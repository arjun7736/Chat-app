import jwt from "jsonwebtoken";
import UserDB from "../models/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split(": ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("No token");
      return next(new Error("Unotherized"));
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    if (!decoded) {
      console.log("Invalied Token");
      return next(new Error("Unautherized"));
    }

    const user = await UserDB.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("No user Found");
      return next(new Error("User Not Found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();

    next();
  } catch (error) {
    console.log("Unexpected Error");
    
  }
};
