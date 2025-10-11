import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  if (!Env.JWT_SECRET) {
    throw new Error("No JWT Secret");
  }
  const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
  });

  return token;
};
