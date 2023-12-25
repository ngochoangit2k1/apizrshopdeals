const WalletSchema = require("../models/wallet.model");
const ConfigTransitiontSchema = require("../models/configTransition.model");
const HistoryWalletSchema = require("../models/historyWallet.model");
const UserSchema = require("../models/user.model");
const ProductSchema = require("../models/product.model");
const PaymentSchema = require("../models/payment.model");
const OrderSchema = require("../models/order.model");
const HistoryAddPointSchema = require("../models/historyAddPoint.model");
// const VietQR  = require ('vietqr')
// const vietQR = new VietQR({
//   clientID: "832c296e-be15-4abc-842a-a15a41e98389",
//   apiKey: "52f8bc71-5486-4a2b-b044-dcaf4cf51ea3",
// });

// const getBankName = async (req, res) => {
//   try {
//     // Assuming getBanks is an asynchronous method, use await
//     const bankName = await vietQR.getBanks();
//     return res.json(bankName);
//   } catch (error) {
//     console.error("Error getting bank names:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const takeOder = async (req, res, next) => {
  const { productId } = req.query;
  try {
    const Commission = await CommissionSchema.findOne({ userId: req.user.id });
    if (Commission.block === true) {
      return res.status(400).json({ message: "tai khoan bi dong bang" });
    }
    const product = await ProductSchema.findOne({ _id: productId });
    if (product) {
      const checkcommis = await CommissionSchema.findOne({
        userId: req.user.id,
      });
      const checkWallet = await WalletSchema.findOne({
        userId: req.user.id,
      });
      if (!checkWallet) {
        return res.status(400).json({ message: "không tìm thấy ví" });
      }

      if (checkcommis.numberOder >= checkcommis.sumOder) {
        const percent = product.price * 0.01;

        await CommissionSchema.findOneAndUpdate(
          {
            userId: req.user.id,
          },
          {
            sumOder: checkcommis.sumOder + 1,
            moneyComissions: checkcommis.moneyComissions + percent,
          }
        );
        const chess = await WalletSchema.findOneAndUpdate(
          { userId: req.user.id },
          { totalAmount: checkWallet.totalAmount + percent }
        );
        console.log(chess);
        return res.status(200).json({ message: "done" });
      } else {
        return res.status(400).json({ message: "không đủ lượt oder" });
      }
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const showTakeOrder = async (req, res) => {
  try {
    const takeOrder = {}; // Use 'takeOrder' instead of 'takeOder'

    const checkCommis = await CommissionSchema.findOne({ userId: req.user.id });
    const checkWallet = await WalletSchema.findOne({ userId: req.user.id });
    console.log(checkCommis);
    if (checkCommis && checkWallet) {
      takeOrder.totalAmount = checkWallet.totalAmount;
      takeOrder.numberOder = checkCommis.numberOder;
      takeOrder.sumOrder = checkCommis.sumOder;
      takeOrder.moneyCommissions = checkCommis.moneyComissions;
      takeOrder.frize = checkCommis.frize;
    }

    return res.status(200).json({ data: takeOrder }); // Return 'takeOrder' as JSON
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const frizes = async (req, res) => {
  try {
    const { userId } = req.body;

    const blockCommisstion = await CommissionSchema.findOne({ userId: userId });
    if (blockCommisstion.block === true) {
      return res.status(400).json({ message: "đã khoá" });
    }
    if (blockCommisstion) {
      await CommissionSchema.findOneAndUpdate(
        { userId: userId },
        {
          moneyComissions: 0,
          frize: blockCommisstion.moneyComissions,
          block: true,
        }
      );
      return res.status(200).json("block");
    } else {
      return res.status(400).json({ message: "ko tìm thay vi nguoi dung" });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const openBlock = async (req, res) => {
  try {
    const { userId } = req.body;

    const blockCommisstion = await CommissionSchema.findOne({ userId: userId });
    if (blockCommisstion.block === false) {
      return res.status(400).json({ message: "đã mở khoá" });
    }
    if (blockCommisstion) {
      await CommissionSchema.findOneAndUpdate(
        { userId: userId },
        {
          block: false,
        }
      );
      return res.status(200).json("open");
    } else {
      return res.status(400).json({ message: "ko tìm thay vi nguoi dung" });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const calculateOder = async (req, totalAmount, next) => {
  const id = "654b9813e11c164e04528e38";
  const transaction = await ConfigTransitiontSchema.findOne({ _id: id });

  const numberOder = (totalAmount / transaction.money) * transaction.numberOder;

  req.numberOder = numberOder;
  next;
};

const historywithdrawWallet = async (userId, totalAmount, codeOder, next) => {
  try {
    const user = await UserSchema.findOne({ _id: userId });
    const bank = await PaymentSchema.findOne({ userId: userId });

    await HistoryWalletSchema.create({
      userId: userId,
      totalAmount: totalAmount,
      nameUser: user.nameUser,
      inf: "withdraw money",
      codeOder: codeOder,
      bankName: bank.bankName,
      bankNumber: bank.accountNumber,
    });
    next;
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const historyRechargeWallet = async (userId, totalAmount, next) => {
  try {
    const user = await UserSchema.findOne({ _id: userId });
    const bank = await PaymentSchema.findOne({ userId: userId });
    const data = await HistoryWalletSchema.create({
      userId: userId,
      totalAmount: totalAmount,
      nameUser: user.nameUser,
      info: "recharge money",
      bankName: bank.bankName,
      bankNumber: bank.accountNumber,
    });
    console.log(data);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const withdrawMoneyToWallet = async (req, res) => {
  const { totalAmount, codeOder } = req.body;
  try {
    const userId = req.user.id;
    const findWallet = await WalletSchema.findOne({ userId: userId });
    if (findWallet.totalAmount < totalAmount) {
      return res.status(400).json({ error: "Bạn ko đủ tiền để rút" });
    }
    if (findWallet) {
      console.log(userId);
      await historywithdrawWallet(userId, totalAmount, codeOder);
      return res.status(200).json("đang chờ xác nhận rút tiền");
    } else {
      return res.status(400).json({ message: "ban chưa tạo ví" });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const createCommission = async (req, userId, totalAmount, next) => {
  try {
    const commission = await CommissionSchema.findOne({ userId: userId });
    await calculateOder(req, totalAmount);
    console.log(req.numberOder);
    if (commission) {
      const data = await CommissionSchema.findOneAndUpdate(
        { userId: userId },
        { numberOder: req.numberOder }
      );
      console.log(data);
      next;
    } else {
      await CommissionSchema.create({
        userId: userId,
        numberOder: req.numberOder,
      });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const addMoneyToWallet = async (req, res) => {
  const { bankName, totalAmount } = req.body;
  const userId = req.user.id;
  try {
    const findWallet = await WalletSchema.findOne({ userId: userId });
    if (findWallet) {
      await historyRechargeWallet(userId, totalAmount);
      // await createCommission(req, userId, totalAmount);
      return res.status(200).json({ message: "đang chờ xác nhận cộng tiền" });
    } else {
      const walletAdd = await WalletSchema.create({
        userId: userId,
        bankName: bankName,
      });
      await historyRechargeWallet(userId, totalAmount);
      await createCommission(userId, totalAmount);
      return res.status(200).json(walletAdd, "đang chờ xác nhận cộng tiền");
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const getHistoryWallet = async (req, res) => {
  const { codeOder } = req.query;
  try {
    if (codeOder) {
      const history = await HistoryWalletSchema.find({
        codeOder: { $regex: codeOder, $options: "i" },
      }).populate("userId");
      return res.status(200).json(history);
    } else {
      const history = await HistoryWalletSchema.find({})
        .populate("userId")
        .sort({ createdAt: -1 });

      return res.status(200).json(history);
    }
  } catch (error) {
    return res.status(404).json({ error });
  }
};

const getHistoryWalletbyUser = async (req, res) => {
  try {
    const user = await HistoryWalletSchema.find({
      userId: req.user.id,
    }).populate("userId");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({ error });
  }
};

const updateHistory = async (req, res, next) => {
  const { id } = req.query;
  try {
    const checkHistory = await HistoryWalletSchema.findOne({ _id: id });

    if (!checkHistory || checkHistory.status === "done") {
      return res.status(200).json({ message: "bạn đã bấm xác nhận" });
    }

    // console.log(history)
    const findWallet = await WalletSchema.findOne({
      userId: checkHistory.userId,
    });
    const userId = checkHistory.userId;
    const totalAmount = checkHistory.totalAmount;
    console.log(checkHistory);
    if (checkHistory.info === "recharge money") {
      const data = await WalletSchema.findOneAndUpdate(
        { userId: checkHistory.userId },
        { totalAmount: findWallet.totalAmount + totalAmount }
      );
      console.log("data", data);
      await HistoryWalletSchema.findOneAndUpdate(
        { _id: id },
        { status: "done" }
      );

      await createCommission(req, userId, totalAmount);
      next;
    } else {
      await WalletSchema.findOneAndUpdate(
        { userId: userId },
        { totalAmount: findWallet.totalAmount - totalAmount }
      );
      await HistoryWalletSchema.findOneAndUpdate(
        { _id: id },
        { status: "done" }
      );
    }
    return res.status(200).json({ message: "trả về thành công" });
  } catch (error) {
    return res.status(404).json({ error });
  }
};

const getWallet = async (req, res) => {
  try {
    const getWallet = await WalletSchema.findOne({ userId: req.user.id });

    return res.status(200).json({ getWallet });
  } catch (error) {
    return res.status(404).json({ error });
  }
};

const getAll = async (req, res) => {
  try {
    const data = {};
    let totalMoneyRecharge = 0;
    let totalMoney = 0;
    const allMoney = await HistoryWalletSchema.find({ status: "done" });

    const allMoneyTotalRecharge = await HistoryWalletSchema.find({
      status: "done",
      info: "recharge money",
    });
    for (const record of allMoney) {
      totalMoney += record.totalAmount;
    }
    for (const record of allMoneyTotalRecharge) {
      totalMoneyRecharge += record.totalAmount;
    }
    const user = await UserSchema.countDocuments({
      isAdmin: false,
      isStaff: false,
    });

    const oder = await OrderSchema.countDocuments({});
    console.log(oder);
    if (allMoney && allMoneyTotalRecharge) {
      data.totalWithdrawal = totalMoney - totalMoneyRecharge;
      data.totalRecharge = totalMoneyRecharge;
      data.countUser = user;
      data.coutOrder = oder;
    }

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(404).json({ error });
  }
};

const addPoints = async (req, res) => {
  try {
    const { points, userId } = req.body;
    if (!points || !userId) {
      return res.status(404).json({ error: "all fields" });
    }
    const checkUser = await UserSchema.findOne({ _id: userId });
    if (!checkUser) {
      return res.status(404).json({ error: "not found" });
    }
    const checkWaller = await WalletSchema.findOne({ userId });

    if (checkWaller) {
      const countAmount = checkWaller.totalAmount + points;
      await WalletSchema.findOneAndUpdate(
        { userId },
        { totalAmount: countAmount }
      );
      await historyAddPoints(userId, points);
    } else {
      await WalletSchema.create({
        userId,
        totalAmount: points,
      });
      await historyAddPoints(userId, points);
    }
    return res.status(200).json({ message: true });
  } catch (error) {
    return res.status(400).json({ message: "no add points" });
  }
};

const historyAddPoints = async (userId, points) => {
  try {
    const user = await UserSchema.findOne({ _id: userId });
    console.log(user.idUser);
    const data = await HistoryAddPointSchema.create({
      userId: userId,
      idUser: user.idUser,
      totalAmount: points,
      nameUser: user.nameUser,
    });
    console.log(data);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const getHistoryAddPoints = async (req, res) => {
  const { userId } = req.query;
  const idUser =  parseInt(userId, 10)
  console.log(idUser)
  try {
    if (userId) {
      const history = await HistoryAddPointSchema.find({
        idUser: { $regex: 55946, $options: "i" },
      }).populate("userId");
      return res.status(200).json(history);
    } else {
      const history = await HistoryAddPointSchema.find({})
        .populate("userId")
        .sort({ createdAt: -1 });

      return res.status(200).json(history);
    }
  } catch (error) {
    return res.status(404).json({ error });
  }
};
module.exports = {
  historyAddPoints,
  getHistoryAddPoints,
  addPoints,
  addMoneyToWallet,
  getHistoryWallet,
  updateHistory,
  withdrawMoneyToWallet,
  takeOder,
  showTakeOrder,
  getWallet,
  getHistoryWalletbyUser,
  openBlock,
  getAll,
};
