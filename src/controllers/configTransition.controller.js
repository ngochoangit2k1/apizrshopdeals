const WalletSchema = require("../models/wallet.model");
const ConfigTransitiontSchema = require("../models/configTransition.model");

const transitiontSetting = async (req, res) => {
  const { money, numberOder } = req.body;
  const id = "654b9813e11c164e04528e38"
  try {
    const transaction = await ConfigTransitiontSchema.findOneAndUpdate(
      { _id: id },
      { money: money, numberOder: numberOder }
    );
    return res.status(200).json("bạn update thành công.");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createTransitiontSetting = async (req, res) => {
  const { money, numberOder } = req.body;
  try {
    const transaction = await ConfigTransitiontSchema.create({
      money: money,
      numberOder: numberOder,
    });
    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updataTransitiontSetting = async (req, res) => {
  const { money } = req.body;
  try {
    const transaction = await ConfigTransitiontSchema.findOneAndUpdate({
      money: money,
    });
    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTransactionsSettings = async (req, res) => {
  const { number } = req.query;
  try {
    const transactions = await ConfigTransitiontSchema.find({});

    // Tạo một mảng để lưu các giao dịch đã cập nhật
    const updatedTransactions = [];

    // Sử dụng vòng lặp for để tạo mảng giao dịch đã cập nhật
    for (let i = 1; i < number; i++) {
      for (const transaction of transactions) {
        const updatedMoney = transaction.money * (number - (number - i));
        const updateNumberOder = transaction.numberOder * (number - (number - i))
        updatedTransactions.push({
          ...transaction.toObject(),
          money: updatedMoney,
          numberOder: updateNumberOder
        });
      }
    }

    return res.status(200).json(updatedTransactions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
  transitiontSetting,
  createTransitiontSetting,
  getTransactionsSettings
};