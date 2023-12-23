const ContactSchema = require("../models/contact.model");

const postContact = async (req, res, next) => {
  try {
    const { name, email, content } = req.body;
    const createContact = await ContactSchema.create({ name, email, content });
    return res.status(200).json(createContact);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const getContact = async (req, res) => {
  try {
    const { name, content } = req.query;
    let query = {};

    if (name && content) {
      query = { $and: [{ name: { $regex: name, $options: "i" } }, { content: { $regex: content, $options: "i" } }] };
    } else if (name) {
      query = { name: { $regex: name, $options: "i" } };
    } else if (content) {
      query = { content: { $regex: content, $options: "i" } };
    }

    const searchContact = await ContactSchema.find(query);

    return res.status(200).json(searchContact);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getAllContact = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const query = {}; 
    const getAllContacts = await ContactSchema.find(query).skip(skip).limit(limit).sort({ __v: -1 });
    const countAllContacts = await ContactSchema.countDocuments(query);
    return res.status(200).json({
      count: countAllContacts,
      page: page,
      comments: getAllContacts,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};
const deleteContact = async (req, res) => {
  try {
    const { id } = req.body;
    for (const deId of id) {
      await ContactSchema.deleteOne({ _id: deId });
    }
    return res.status(200).json("Đã xóa xong");
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  postContact,
  getAllContact,
  getContact,
  deleteContact
};
