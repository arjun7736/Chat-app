import { generateToken } from "../lib/utils.js";
import UserDB from "../models/User.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Fill all Field" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password Must be 6 charecters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "invalied Email" });
    }

    const user = await UserDB.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email Already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = new UserDB({
      name,
      email,
      password: hashPass,
    });
    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalied Data" });
    }
  } catch (error) {
    console.error("Signup Faild", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Fill all field" });
  }
  try {
    const user = await UserDB.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "invalied credentials" });
    }

    const isPassVaslied = await bcrypt.compare(password, user.password);

    if (!isPassVaslied) {
      return res.status(400).json({ message: "invalied credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logout" });
};

export const updateProfile = async (req, res) => {
  try {
    const profilePic = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic Required" });
    }
    const userId = req.user._id;

    const upRes = await cloudinary.uploader.upload(profilePic);

    const updated = await UserDB.findByIdAndUpdate(
      userId,
      { profilePic: upRes.secure_url },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
