const WalletSchema = require("../models/wallet.model");
const ConfigTransitiontSchema = require("../models/configTransition.model");
const moneyConfigSchema = require("../models/settingMoneyWithdraw.model")
const HistoryWalletSchema = require("../models/historyWallet.model");
const UserSchema = require("../models/user.model");
const ProductSchema = require("../models/product.model");
const PaymentSchema = require("../models/payment.model");
const OrderSchema = require("../models/order.model");
const { ObjectID } = require('mongodb');
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
    // const tiLe = await ConfigTransitiontSchema.findOne();
    // const sumTotalAmount = totalAmount - (totalAmount*(tiLe.numberOder/100));
    console.log(totalAmount)
    await HistoryWalletSchema.create({
      userId: userId,
      totalAmount: totalAmount,
      nameUser: user.nameUser,
      inf: "withdraw money",
      codeOder: codeOder,
      nameUserBank: bank.nameUserBank,
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
    const user = await UserSchema.findOne({ _id: userId });
    const Payment = await PaymentSchema.findOne({ userId: userId });
    const moneyMin = await moneyConfigSchema.findOne();
    if (user.isDongBang === true) {
      return res.status(400).json({ error: "Tiền quý khách đã bị đóng băng. \nVui lòng liên hệ CSKH để được xử lý!" });
    }
    const a = findWallet.totalAmount
    if (a < totalAmount) {
      return res.status(400).json({ error: "Bạn ko đủ tiền để rút" });
    }
    if (totalAmount < moneyMin.number) {
      return res.status(400).json({ error: `Bạn vui lòng rút tiền lớn hơn tiền tối thiểu là ${moneyMin.number}₫` });
    }
    if (!Payment) {
      return res.status(400).json({ error: "Bạn chưa thêm tài khoản ngân hàng." });
    }
    if (!Payment.bankName) {
      return res.status(400).json({ error: "Bạn chưa thêm tên ngân hàng. \nVui lòng liên hệ CSKH để được xử lý!" });
    }
    if (!Payment.nameUserBank) {
      return res.status(400).json({ error: "Bạn chưa thêm tên tài khoản ngân hàng. \nVui lòng liên hệ CSKH để được xử lý!" });
    }
    if (!Payment.accountNumber) {
      return res.status(400).json({ error: "Bạn chưa thêm số tài khoản ngân hàng. \nVui lòng liên hệ CSKH để được xử lý!" });
    }
    if (findWallet) {
      console.log(userId);
      const sum = a - totalAmount
      // await sum.push
      await WalletSchema.findOneAndUpdate({ userId: userId }, { totalAmount: sum });
      await historywithdrawWallet(userId, totalAmount, codeOder);
      return res.status(200).json("đang chờ xác nhận rút tiền");
    } else {
      return res.status(400).json({ error: "ban chưa tạo ví" });
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
    }).populate("userId").sort({ createdAt: -1 });
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
    const userId = req.user.id;
    // const getWallet = await HistoryAddPointSchema.findOne({ userId: req.user.id });
    const getWallet = await WalletSchema.findOne({ userId });
    const configRate = await ConfigTransitiontSchema.findOne();

    if (!getWallet) {
      return res.status(404).json({ error: 'Wallet not found for the user.' });
    }
    console.log(configRate)

    // Thêm thông tin từ configRate vào wallet
    getWallet.money = configRate;

    return res.status(200).json({
      // totalAmount: getWallet.totalAmount,
      // _id: getWallet._id,
      // userId: getWallet.userId 
      getWallet: {
        totalAmount: getWallet.totalAmount,
        _id: getWallet._id,
        userId: getWallet.userId,
        money: getWallet.money,
        createdAt: getWallet.createdAt,
        updatedAt: getWallet.updatedAt
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
    const user = await UserSchema.findOne({ _id: userId }).sort({ createdAt: -1 });
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
  const { userId, username } = req.query;
  const idUser = parseInt(userId, 10);

  try {
    let history;

    if (userId || username) {
      const user = await UserSchema.findOne({
        $or: [{ idUser: idUser }, { username: username }]
      });

      if (user) {
        history = await HistoryAddPointSchema.find({
          userId: user._id,
        })
          .populate("userId")
          .sort({ createdAt: -1 });
      } else {
        history = [];
      }
    } else {
      history = await HistoryAddPointSchema.find({})
        .populate("userId")
        .sort({ createdAt: -1 });
    }

    return res.status(200).json(history);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const getHistoryAddPointUser = async (req, res) => {
  const userId = req.user.id;

  try {
    if (userId) {
      const history = await HistoryAddPointSchema.find({ userId }).sort({ createdAt: -1 });

      if (history) {
        return res.status(200).json(history);
      } else {
        return res.status(404).json({ message: 'Không tìm thấy lịch sử cho người dùng này.' });
      }
    } else {
      return res.status(400).json({ message: 'UserID không hợp lệ.' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const historywithdrawWalletAdmin = async (req, res) => {
  const { userId, username } = req.query;
  try {
    let history;
    if (userId) {
      const user = await UserSchema.findOne({
        $or: [{ idUser: userId }, { username: username }]
      });

      if (user) {
        history = await HistoryWalletSchema.find({
          userId: user._id,
        })
          .populate("userId")
          .sort({ createdAt: -1 })
          .limit(30);
      } else {
        history = [];
      }
    } else if (username) {
      const user = await UserSchema.findOne({ username: username });

      if (user) {
        history = await HistoryWalletSchema.find({
          userId: user._id,
        })
          .populate("userId")
          .sort({ createdAt: -1 })
          .limit(30);
      } else {
        history = [];
      }
    } else {
      history = await HistoryWalletSchema.find({})
        .populate("userId")
        .sort({ createdAt: -1 })
        .limit(30);
    }

    return res.status(200).json(history);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const updateWalletAdmin = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const checkHistory = await HistoryWalletSchema.findById(id);

    if (!checkHistory) {
      return res.status(404).json({ message: "Không tìm thấy lịch sử ví" });
    }
    console.log(checkHistory.userId)
    if (checkHistory.status === "done") {
      return res.status(200).json({ message: "Bạn đã bấm xác nhận" });
    } else if (checkHistory.status === "false") {
      return res.status(200).json({ message: "Bạn đã bấm từ chối" });
    }
    if (req.body.nfo) {
      await HistoryWalletSchema.findByIdAndUpdate(id, { nfo: req.body.nfo });
    }
    if (checkHistory.status === "pending") {
      await HistoryWalletSchema.findByIdAndUpdate(id, { status: status });
    }

    if (status === "false") {
      const findWL = await WalletSchema.findOne({ userId: checkHistory.userId });
      const a = findWL.totalAmount
      console.log(a)
      await WalletSchema.findOneAndUpdate({ userId: checkHistory.userId }, { totalAmount: a + checkHistory.totalAmount })
    }


    // Cập nhật ví tại đây nếu cần

    return res.status(200).json({ message: "Xác nhận thành công" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateWalletAdmin,
  historyAddPoints,
  getHistoryAddPoints,
  getHistoryAddPointUser,
  addPoints,
  addMoneyToWallet,
  getHistoryWallet,
  updateHistory,
  historywithdrawWalletAdmin,
  withdrawMoneyToWallet,
  takeOder,
  showTakeOrder,
  getWallet,
  getHistoryWalletbyUser,
  openBlock,
  getAll,
};
