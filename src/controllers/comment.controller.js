const CommentSchema = require("../models/comment.model");
const UserSchema = require("../models/user.model");
const auth = require("../middlewares/auth");
const postComment = async (req, res) => {
  try {
    const { phone, email, address, content } = req.body;
    const createComment = await CommentSchema.create({
      phone,
      email,
      address,
      content,
    });
    return res.status(200).json(createComment);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const searchComent = async (req, res) => {
  try {
    const { email, content } = req.query;
    let query = {};

    if (email && content) {
      query = {
        $and: [
          { email: { $regex: email, $options: "i" } },
          { content: { $regex: content, $options: "i" } },
        ],
      };
    } else if (email && content == null) {
      query = { name: { $regex: email, $options: "i" } };
    } else if (content && email == null) {
      query = { content: { $regex: content, $options: "i" } };
    }

    const searchComment = await CommentSchema.find(query);

    return res.status(200).json(searchComment);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getAllComent = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const query = {};
    const getAllComent = await CommentSchema.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const countAllComments = await CommentSchema.countDocuments(query);
    return res.status(200).json({
      count: countAllComments,
      page: page,
      comments: getAllComent,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

const deleteComent = async (req, res) => {
  try {
    const { id } = req.body;
    for (const deId of id) {
      await CommentSchema.deleteOne({ _id: deId });
    }
    return res.status(200).json("Đã xóa xong");
  } catch (error) {
    return res.status(400).json(error);
  }
};

const repComments = async (req, res) => {
  const { id, phone, email, address, content } = req.body;
  try {
    const existingComment = await CommentSchema.findById(id);
    if (!existingComment) {
      return res.status(404).json({ error: 'Không tìm thấy bình luận.' });
    }

    existingComment.replies.push({ phone, email, address, content });
    const updatedComment = await existingComment.save();

    return res.status(201).json(updatedComment);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const repComment = async (req, res) => {
  const { id, replies: [{content}] } = req.body;
  try {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        errMessage: 'Token không hợp lệ hoặc người dùng không xác thực.',
      });
    }
    const userId = req.user ? req.user.id : null;
    const user = await UserSchema.findById(userId);
    const comment = await CommentSchema.findById(id);

    if (!comment) {
      return res.status(404).json({
        ok: false,
        errMessage: 'Không tìm thấy bình luận.',
      });
    }

    const newReply = {
      email: user.email,
      isAdmin: user.isAdmin,
      isStaff: user.isStaff,
      content: content,
    };

    comment.replies.push(newReply);
    await comment.save();
    console.log(newReply.content)
    return res.status(201).json(comment);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getAllComent,
  postComment,
  searchComent,
  repComments,
  repComment,
  deleteComent,
};
