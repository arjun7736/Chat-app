import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT;


app.use(express.json())
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

app.listen(port, () => {
  console.log("server start " + port);
  connectDB()
});
