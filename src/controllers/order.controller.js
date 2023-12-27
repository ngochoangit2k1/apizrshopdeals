const OrderSchema = require("../models/order.model");
const WalletSchema = require("../models/wallet.model");
const ClientSchema = require("../models/client.model");
const FashionSchema = require("../models/fashion.model");
const UserSchema = require("../models/user.model");
const ProductSchema = require("../models/product.model");

const generateRandomString = (length) => {
  const characters = "0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

//Product
const createProductCode = async (req, res) => {
  try {
    const random = generateRandomString(5);
    const clientCode = await ProductSchema.create({
      randomNumber: random,
    });
    console.log(clientCode);
  } catch (error) {
    return res.status(400).json(err);
  }
};
const getProductCode = async (req, res) => {
  try {
    const getProductCode = await ProductSchema.find()
      .sort({ createdAt: -1 })
      .limit(20);
    return res.status(200).json(getClientCode);
  } catch (error) {
    return res.status(400).json(err);
  }
};

const getNewProductCode = async (req, res) => {
  try {
    const getProductCode = await ProductSchema.find()
      .sort({ createdAt: -1 })
      .limit(1);
    return res.status(200).json(getClientCode);
  } catch (error) {
    return res.status(400).json(err);
  }
};

const getClientCode = async (req, res) => {
  try {
    const getClientCode = await ClientSchema.find()
      .sort({ createdAt: -1 })
      .limit(20);
    return res.status(200).json(getClientCode);
  } catch (error) {
    return res.status(400).json(err);
  }
};
//Product
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { countNum, codeOrder, randomNumber } = req.body;

    const wallet = await WalletSchema.findOne({ userId: userId });
    const user = await UserSchema.findOne({ _id: userId });
    if (!wallet || !user) {
      return res.status(400).json({ error: "Không tìm thấy ví người dùng" });
    }

    const totalAmount = wallet.totalAmount;
    console.log(totalAmount);

    if (totalAmount > 0 && countNum > 0 && totalAmount >= countNum) {
      await OrderSchema.create({
        username: user.username,
        idUser: user.idUser,
        userId: userId,
        countNum: countNum,
        codeOrder: codeOrder,
        randomNumber: randomNumber,
      });

      const updatedTotalAmount = totalAmount - countNum;
      await WalletSchema.findOneAndUpdate(
        { userId: userId },
        { totalAmount: updatedTotalAmount }
      );

      return res
        .status(200)
        .json({ success: true, message: "Đã tạo đơn hàng thành công" });
    } else {
      return res
        .status(400)
        .json({ error: "Số điểm không đủ hoặc số lượng không hợp lệ" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Lỗi server" });
  }
};

const HistoryAllOrders = async (req, res) => {
  try {
    const { search } = req.query;
    if (search) {
      const history = await OrderSchema.find({
        $or: [
          { username: { $regex: search, $options: "i" } }, // Tìm kiếm theo tên (không phân biệt chữ hoa/chữ thường)
          { idUser: { $regex: search, $options: "i" } }, // Tìm kiếm theo ID
        ],
      }).sort({ createdAt: -1 });
      return res.status(200).json({ history });
    } else {
      const history = await OrderSchema.find().sort({ createdAt: -1 });
      return res.status(200).json({ history });
    }
  } catch (error) {
    return res.status(500).json({ error: "Lỗi server" });
  }
};
const HistoryOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await OrderSchema.find({
      userId: userId,
    }).sort({ createdAt: -1 });
    return res.status(200).json({ history });
  } catch (error) {
    return res.status(500).json({ error: "Lỗi server" });
  }
};

// const UpdateStatusHistory = async (req, res) => {
//   try {
//     const { idHistory } = req.query;
//     const updateHistory = await OrderSchema.findOneAndUpdate(
//       { _id: idHistory },
//       { status: "done" }
//     );
//     return res.status(200).json({ message: "done", updateHistory });
//   } catch (error) {
//     return res.status(500).json({ error: "Lỗi server" });
//   }
// };
const UpdateStatusOrder = async (req, res, next) => {
  try {
    const { id } = req.query;
    const { status } = req.body;
    const checkHistory = await OrderSchema.findOne({ _id: id });
    if (!checkHistory) {
      return res.status(404).json({ message: "Không tìm thấy lịch sử ví", status: "false" });
    }
    if (status === "done") {
      await OrderSchema.findOneAndUpdate({ _id: id }, { status: status });

      return res.status(200).json({ message: "Bạn đã bấm xác nhận",  status: "true" });
    } else if (status === "false") {
      await OrderSchema.findOneAndUpdate({ _id: id }, { status: status });
      const findWL = await WalletSchema.findOne({
        userId: checkHistory.userId,
      });
      const a = findWL.totalAmount;
      await WalletSchema.findOneAndUpdate(
        { userId: checkHistory.userId },
        { totalAmount: a + checkHistory.totalAmount }
      );
      return res.status(200).json({ message: "Bạn đã bấm từ chối" , status: "true"});
    }
    if (status === "pending") {
      await OrderSchema.findOneAndUpdate(
        { _id: id },
        { status: status }
      );
    }
    if (status === "lost") {
      await OrderSchema.findOneAndUpdate(
        { _id: id },
        { status: status }
      );
      return res.status(200).json({ message: "Bạn đã bấm xác nhận",  status: "true" });
    }
    if (status === "delete") {
      await OrderSchema.findOneAndDelete({ _id: id });
      return res.status(200).json({ message: "delete true", status: "true"});
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  UpdateStatusOrder,
  HistoryOrdersByUser,
  createOrder,
  createProductCode,
  getNewProductCode,
  getProductCode,
  HistoryAllOrders,
}
