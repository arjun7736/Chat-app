import UserDB from "../models/User.js";
import MessageDB from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedUser = req.user._id;

    const filteredUsers = await UserDB.find({
      _id: { $ne: loggedUser },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const message = await MessageDB.find({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: myId },
      ],
    });
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Message required" });
    }

    if (senderId.equals(recieverId)) {
      return res.status(400).json({ message: " Cannot sent Message Yourself" });
    }

    const recieverExists = await UserDB.exists({ _id: recieverId });
    
    if (!recieverExists) {
      return res.status(404).json({ message: "Reciever not Found" });
    }

    let imageUrl;

    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image);
      imageUrl = uploadRes.secure_url;
    }

    const newMessage = new MessageDB({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    const recieverSocketId = getRecieverSocketId(recieverId);

    if (recieverId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedUser = req.user._id;

    const messages = await MessageDB.find({
      $or: [{ senderId: loggedUser }, { recieverId: loggedUser }],
    });

    const chatPartnersIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() == loggedUser.toString()
            ? msg.recieverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await UserDB.find({
      _id: { $in: chatPartnersIds },
    }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
