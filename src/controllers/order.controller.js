const OrderSchema = require("../models/order.model");
const ProductSchema = require("../models/product.model");

const createOrder = async (req, res) => {
  try {
    const {
      name,
      complete,
      email,
      phone,
      tinh,
      quan,
      xa,
      note,
      mota,
      status,
      code,
      Sum,
      soDon,
      quantity,
      products,
      isPayment,
      address,
    } = req.body;

    const newOrder = await OrderSchema.create({
      name,
      complete,
      email,
      phone,
      tinh,
      quan,
      xa,
      mota,
      code,
      note,
      status,
      products,
      isPayment,
      Sum,
      soDon,
      quantity,
      address,
    });
    return res.status(200).send({
      ok: true,
      orders: newOrder,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Lỗi server" });
  }
};

const searchOrder = async (req, res) => {
  try {
    const { title, name, email } = req.query;
    let query = {};

    if (title) {
      query = { title: { $regex: title, $options: "i" } };
    } else if (name) {
      query = { name: { $regex: name, $options: "i" } };
    } else if (email) {
      query = { email: { $regex: email, $options: "i" } };
    }

    const searchOrder = await OrderSchema.find(query);

    return res.status(200).json(searchOrder);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getAllOrder = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const query = {};
    const getAllOrders = await OrderSchema.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ __v: -1 });
    const countAllOrders = await OrderSchema.countDocuments(query);
    return res.status(200).json({
      count: countAllOrders,
      page: page,
      limit: limit,
      orders: getAllOrders,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.Order });
  }
};

// const getOrdersByCategory = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const categoryId = req.query.categoryId;

//     const category = await CategorySchema.findById(categoryId);

//     if (!category) {
//       return res.status(404).json({ msg: 'Danh mục không tồn tại' });
//     }

//     const query = { category: categoryId };

//     const OrdersInCategory = await OrderSchema.find(query)
//     .skip(skip).limit(limit).sort({ __v: -1 });

//     const countAllOrders = await OrderSchema.countDocuments(query);

//     return res.status(200).json({
//       category: category.nameCategory,
//       page: page,
//       limit: limit,
//       count: countAllOrders,
//       Orders: OrdersInCategory,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ msg: 'Lỗi server' });
//   }
// };

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const updatedData = req.body;

    if (req.files && req.files[0] && req.files[0].path) {
      updatedData.image = req.files[0].path;
    }

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        ok: false,
        errMessage: "Không có dữ liệu để cập nhật.",
      });
    }

    const Order = await OrderSchema.findByIdAndUpdate(orderId, updatedData, {
      new: true,
    });

    if (!Order) {
      return res.status(404).json({
        ok: false,
        errMessage: "Không tìm thấy Order để cập nhật.",
      });
    }

    return res.status(200).json({
      ok: true,
      Order: Order,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Lỗi server" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    await OrderSchema.findByIdAndDelete(orderId);

    return res.status(200).json("Đã xóa xong");
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  createOrder,
  getAllOrder,
  // getOrdersByCategory,
  searchOrder,
  updateOrder,
  deleteOrder,
};
