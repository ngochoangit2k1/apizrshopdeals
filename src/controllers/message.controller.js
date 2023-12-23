const MessageSchema = require("../models/message.model");
const UserSchema = require("../models/user.model");

const postMessage = async (req, res, next) => {
  try {
    const { message, sender } = req.body;
    const check = await MessageSchema.findOne({
      sender: sender,
    });
    const user = await  UserSchema.findOne({_id: sender});
    if(!user) return res.status(404).json({message: 'No such user'})
    if (check) {
      const newContent = {
        userId: req.user.id,
        message: message,
      };
      let status = {};
      if (req.user.id === "654c882d3fdff716506f3b93") {
        status.status = true;
      } else {
        status.status = false;
      }
      console.log(status);
      const addMess = await MessageSchema.findOneAndUpdate(
        {
          sender: sender,
        },
        { status: status.status, $push: { content: newContent } }
      );
      return res.status(200).json(addMess);
    } else {
      const createMessage = await MessageSchema.create({
        sender: sender,
        content: [
          {
            userId: req.user.id,
            message: message,
          },
        ],
      });
      return res.status(200).json(createMessage);
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

const getMessagebyUser = async (req, res, next) => {
  try {
    const getMessage = await MessageSchema.findOne({
      sender: req.user.id,
    });
    return res.status(200).json({ getMessage });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getMessagebyAdmin = async (req, res, next) => {
  const { sender } = req.query;
  try {
    const getMessage = await MessageSchema.findOne({
      sender: sender,
    });
    return res.status(200).json({ getMessage });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getMessage = async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};

    if (email) {
      query = { email: { $regex: email, $options: "i" } };
    }

    const searchMessage = await MessageSchema.find(query);

    return res.status(200).json(searchMessage);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getAllMessage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const query = {};
    // Fetch messages with pagination and sorting
    const getAllMessages = await MessageSchema.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ __v: -1 });

    // Extract sender IDs from messages
    const userIds = getAllMessages.map((user) => user.sender);

    // Fetch users based on sender IDs
    const users = await UserSchema.find({
      _id: { $in: userIds },
    });

    // Map messages with user information
    const messagesWithUserInfo = getAllMessages.map((message) => {
      const user = users.find(
        (user) => user?._id?.toString() === message?.sender?.toString()
      );
      return {
        ...message.toObject(),
        userName: user ? user.name : null,
      };
    });

    // Create a new array without sensitive information
    const messagesWithoutPassword = messagesWithUserInfo.map((message) => {
      const { password, ...messageWithoutPassword } = message;
      return messageWithoutPassword;
    });

    // Count all messages
    const countAllMessages = await MessageSchema.countDocuments(query);

    // Return the response
    return res.status(200).json({
      count: countAllMessages,
      page: page,
      messages: messagesWithoutPassword,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.body;
    for (const deId of id) {
      await MessageSchema.deleteOne({ _id: deId });
    }
    return res.status(200).json("Đã xóa xong");
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  postMessage,
  getAllMessage,
  getMessage,
  deleteMessage,
  getMessagebyUser,
  getMessagebyAdmin,
};
