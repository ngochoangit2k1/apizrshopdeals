const PaymentSchema = require("../models/payment.model");
const UserSchema = require("../models/user.model");

const postPayment = async (req, res, next) => {
  try {
    const { bankName, accountNumber, userId, name } = req.body;
    const user = await UserSchema.findOne({ _id: userId });
    if (user) {
      const createPayment = await PaymentSchema.create({
        bankName,
        accountNumber,
        userId,
        nameUserBank: name
      });
      return res.status(200).json(createPayment);
    } else {
      return res.status(400).json({ message: "không tìm thấy người dùng" });
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

const getBankByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const findInfoBankUser = await PaymentSchema.findOne({
      userId: userId,
    }).populate("userId", "name");
    return res.status(200).json(findInfoBankUser);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getPayment = async (req, res) => {
  try {
    const { bankName } = req.query;
    let query = {};

    if (bankName) {
      query = { bankName: { $regex: bankName, $options: "i" } };
    }

    const searchPayment = await PaymentSchema.find(query);

    return res.status(200).json(searchPayment);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getAllPayment = async (req, res) => {
  try {
    const getAllPayments = await PaymentSchema.find();
    return res.status(200).json({
      payments: getAllPayments,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.Payment });
  }
};

const deletePayment = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    await PaymentSchema.findByIdAndDelete(paymentId);
    return res.status(200).json("Đã xóa xong");
  } catch (error) {
    return res.status(400).json(error);
  }
};

const updatePayment = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const { ...accountNumber } = req.body;
    const updatedPayment = await PaymentSchema.findByIdAndUpdate(
      paymentId,
      { ...accountNumber },
      { new: true }
    );

    return res.status(200).json({
      payment: updatedPayment,
      oke: "Đã cập nhật xong",
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const settingBank = async (req, res) => {};
const settingWallet = async (req, res) => {};

module.exports = {
  postPayment,
  getAllPayment,
  getPayment,
  deletePayment,
  updatePayment,
  getBankByUser,
};
