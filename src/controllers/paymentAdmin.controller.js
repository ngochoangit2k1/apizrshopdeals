// const BrandSchema = require("../models/brand.model");

const PaymentAdminSchema = require("../models/paymentAdmin.model");

const createPaymentAdmin = async (req, res, next) => {
  try {
    const { bankName, bankNumber, bankUsername } = req.body;
    console.log(req.body);

    const image = req.files && req.files[0] ? req.files[0].path : "";
    if (!bankName || !bankNumber || !bankUsername) {
      return res.status(400).json({ error: "ban phai nhap du cac truong" });
    }
    const create = await PaymentAdminSchema.create({
      bankUsername,
      bankName,
      bankNumber,
      image,
    });
    return res.status(200).json({ create });
  } catch (error) {
    return res.status(400).json({ message: err });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(id);
    const { bankName, bankNumber, bankUsername } = req.body;
    const image = req.files && req.files[0] ? req.files[0].path : "";
    if (!bankName || !bankNumber) {
      return res.status(400).json({ error: "ban phai nhap du cac truong" });
    }
    const idx = await PaymentAdminSchema.findOne({ _id: id });
    if (idx) {
      const update = await PaymentAdminSchema.findOneAndUpdate(
        { _id: id },
        {
          bankName,
          bankNumber,
          image,
          bankUsername,
        }
      );
      return res.status(200).json({ update, message: "Succsess" });
    } else {
      return res.status(400).json({ message: "không tìm thấy phương thức" });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const get = async (req, res) => {
  try {
    const getpay = await PaymentAdminSchema.find({});
    return res.status(200).json(getpay);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
const getUser = async (req, res) => {
  try {
    const { id } = req.query;

    const getpay = await PaymentAdminSchema.findOne({ _id: id });
    return res.status(200).json(getpay);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
const deletePayment = async (req, res) => {
  try {
    const { id } = req.query;
    const idx = await PaymentAdminSchema.findOne({ _id: id });
    if (idx) {
      const deletePayment = await PaymentAdminSchema.findOneAndDelete({
        _id: id,
      });
      return res.status(200).json({ deletePayment, message: "Succsess" });
    } else {
      return res.status(400).json({ message: "không tìm thấy phương thức" });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
module.exports = {
  createPaymentAdmin,
  update,
  get,
  deletePayment,
  getUser,
};
