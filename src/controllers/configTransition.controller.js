const WalletSchema = require("../models/wallet.model");
const ConfigTransitiontSchema = require("../models/configTransition.model");
const countdownConfigSchema = require("../models/countdownConfig.model")

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
const getSetting = async (req, res) => {
  // const { number } = req.query;
  try {
    const transactions = await ConfigTransitiontSchema.find({});

    // Tạo một mảng để lưu các giao dịch đã cập nhật
    // const updatedTransactions = [];

    // // Sử dụng vòng lặp for để tạo mảng giao dịch đã cập nhật
    // for (let i = 1; i < number; i++) {
    //   for (const transaction of transactions) {
    //     const updatedMoney = transaction.money * (number - (number - i));
    //     const updateNumberOder = transaction.numberOder * (number - (number - i))
    //     updatedTransactions.push({
    //       ...transaction.toObject(),
    //       money: updatedMoney,
    //       numberOder: updateNumberOder
    //     });
    //   }
    // }

    return res.status(200).json(transactions);
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

const countdownSettings = async (req, res) => {
  const { countdown } = req.body;
  const id = "658aef294dd9f01b18a3adc7"
  try {
    const transaction = await countdownConfigSchema.findOneAndUpdate(
      { _id: id },
      { countdown:countdown }
    );
    return res.status(200).json({message:"bạn update thành công.", data: transaction});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const createCountdownSettings = async (req, res) => {
    const { countdown } = req.body;
  try {
    const transaction = await countdownConfigSchema.create({
      countdown:countdown
    });
    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
const getCountdownSettings = async (req, res) => {
  try {
    const id = "658aef294dd9f01b18a3adc7"

    const transaction = await countdownConfigSchema.findOne(
      { _id: id },
    );
    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
module.exports = {
  transitiontSetting,
  getSetting,
  updataTransitiontSetting,
  createTransitiontSetting,
  getTransactionsSettings,
  // countdownSettings
  countdownSettings,
  createCountdownSettings,
  getCountdownSettings
};