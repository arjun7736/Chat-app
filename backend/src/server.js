import express from "express";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express();
const port = ENV.PORT

app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

app.listen(port, () => {
  console.log("server start " + port);
  connectDB()
});
