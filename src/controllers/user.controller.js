const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = require("../models/user.model");
const auth = require("../middlewares/auth");
const config = require("../config/config");
const { validateEmail } = require("../validates/auth.validate");
const PaymentSchema = require("../models/payment.model");

const generateRandomString = (length) => {
  const characters = "0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

const register = async (req, res) => {
  try {
    const { password, username, idRef } = req.body;
    if (!(username && password && idRef)) {
      return res.status(400).json({
        oke: false,
        errMessage: "Thiếu tên người dùng, mật khẩu, username, mã giới thiệu!",
      });
    }

    const checkId = await UserSchema.findOne({ idUser: idRef })
    if (!checkId) {
      return res.status(400).json({
        oke: false,
        errMessage: "Thiếu tên người dùng, mật khẩu, username, mã giới thiệu!",
      });
    }

    const users = await UserSchema.findOne({ username });

    if (users) {
      return res.status(400).json({
        oke: false,
        errMessage: " User đã được sử dụng!",
      });
    }
    if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
      return res.status(400).json({
        oke: false,
        errMessage: "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số!",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        oke: false,
        errMessage: "Mật khẩu phải lớn hơn 6 kí tự!",
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    let idUser;

    do {
      idUser = generateRandomString(5);
      checkIdUser = await UserSchema.findOne({ idUser });
    } while (checkIdUser);


    const newUser = new UserSchema({
      idRef: idRef,
      username: username,
      password: passwordHash,
      idUser: idUser,
    });
    await newUser.save();

    const user = await UserSchema.findOne({ username });
    const token = auth.generateToken(user._id, user.username);
    const expires_in = auth.expiresToken(token);

    user.password = undefined;
    user.__v = undefined;
    res.status(200).json({
      oke: true,
      message: "Bạn đã tạo tài khoản thành công! 🎉'",
      user,
      token,
      expires_in,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMessage: error.message });
  }
};

const referralCode = async (req, res) => {
  try {
    const referral = {};
    const user = await UserSchema.findOne({ _id: req.user.id });
    const refUser = await UserSchema.findOne({ idUser: user.idRef });
    const numRef = await UserSchema.find({ idRef: user.idUser })
      .select("name idRef idUser")
      .exec();
    const numTeams = await UserSchema.find({ idRef: user.idRef })
      .select("name idRef idUser")
      .exec();
    if (!user) {
      return res.status(404).json({ errMessage: "Không tìm thấy người dùng" });
    }
    if (!refUser) {
      return res.status(404).json({ errMessage: "Không tìm team" });
    }
    if (user && refUser) {
      referral.nameUser = user.name;
      referral.idUser = user.idUser;
      referral.numRef = numRef;
      referral.nameRef = refUser.name;
      referral.idRef = user.idRef;
      referral.numTeams = numTeams;
    }
    return res.status(200).json(referral);
  } catch (error) {
    return res.status(500).json({ errMessage: error.message });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { password, username } = req.body;
    if (!(username && password)) {
      return res.status(400).json({
        oke: false,
        errMessage: "Thiếu tên người dùng, mật khẩu!",
      });
    }
    if (!validateEmail(username)) {
      return res.status(400).json({
        oke: false,
        errMessage: " Email không hợp lệ!",
      });
    }
    const users = await UserSchema.findOne({ username });

    if (users) {
      return res.status(400).json({
        oke: false,
        errMessage: " Email đã được sử dụng!",
      });
    }
    if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
      return res.status(400).json({
        oke: false,
        errMessage: "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số!",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        oke: false,
        errMessage: "Mật khẩu phải lớn hơn 6 kí tự!",
      });
    }
    let idUser;
    do {
      idUser = generateRandomString(5);
      checkIdUser = await UserSchema.findOne({ idUser });
    } while (checkIdUser);

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const newUser = new UserSchema({
      username: username,
      password: passwordHash,
      idUser: idUser,
      isStaff: true,
    });
    await newUser.save();
    res.status(200).json({
      oke: true,
      message: "Bạn đã tạo tài khoản thành công! 🎉'",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMessage: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(400).send({
      ok: false,
      errMessage: "Vui lòng điền tất cả các thông tin cần thiết!",
    });
  }

  try {
    const user = await UserSchema.findOne({ username });

    if (!user) {
      return res.status(400).send({
        ok: false,
        errMessage: "Tài khoản không tồn tại!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send({
        ok: false,
        errMessage: "Bạn đã nhập mật khẩu sai😞",
      });
    }

    const token = auth.generateToken(user._id, user.username);
    const expires_in = auth.expiresToken(token);

    user.password = undefined;
    user.__v = undefined;

    return res.status(200).send({
      ok: true,
      message: "Đăng nhập thành công! 🎉",
      user,
      token,
      expires_in,
    });
  } catch (err) {
    return res.status(500).send({
      ok: false,
      errMessage: "Đã xảy ra lỗi trong quá trình đăng nhập.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { username, password, newPassword } = req.body;
    if (!(username && password)) {
      return res
        .status(400)
        .json({ error: "Vui lòng điền tất cả các thông tin cần thiết!" });
    } else {
      const user = await UserSchema.findOne({ username });

      if (!user) {
        return res.status(400).send({
          ok: false,
          errMessage: "Tài khoản không tồn tại!",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).send({
          ok: false,
          errMessage: "Bạn đã nhập mật khẩu sai😞",
        });
      }
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(newPassword, salt);
      const updatePassword = await UserSchema.findOneAndUpdate(
        { username: username },
        { password: passwordHash }
      );
      return res.status(200).json({ data: updatePassword });
    }
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        errMessage: "Token không hợp lệ hoặc người dùng không xác thực.",
      });
    }
    const userId = req.user ? req.user.id : null;
    const user = await UserSchema.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        ok: false,
        errMessage: "Không tìm thấy người dùng.",
      });
    }
    user.isAdmin = undefined;
    user.isStaff = undefined;
    user.password = undefined;
    user.__v = undefined;

    res.status(200).json({
      ok: true,
      user,
      bank,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      errMessage: "Lỗi trong quá trình lấy thông tin người dùng.",
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await UserSchema.find({ isAdmin: false }).sort("__v");
    const userIds = users.map((user) => user._id);

    // Lấy thông tin PaymentSchema dựa trên userIds
    const paymentInfo = await PaymentSchema.find({ userId: { $in: userIds } });

    // Merging thông tin PaymentSchema vào mỗi user
    const usersWithPaymentInfo = users.map((user) => {
      const userPaymentInfo = paymentInfo.find(
        (info) => info.userId.toString() === user._id.toString()
      );

      return {
        ...user.toObject(),
        bankName: userPaymentInfo ? userPaymentInfo.bankName : null,
        banKNumber: userPaymentInfo ? userPaymentInfo.accountNumber : null,
      };
    });
    const usersWithoutPassword = usersWithPaymentInfo.map((user) => {
      const { password, isAdmin, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    const countAllUsers = users.length;

    return res.status(200).json({
      count: countAllUsers,
      user: usersWithoutPassword,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

const searchStaff = async (req, res) => {
  try {
    const { name, username, idUser } = req.query;
    let query = {};
    
    if (name && username && idUser) {
      query = {
        $and: [
          { name: { $regex: name, $options: "i" } },
          { username: { $regex: username, $options: "i" } },
          { idUser: { $regex: idUser, $options: "i" } },
        ],
      };
    } else if (name) {
      query = { name: { $regex: name, $options: "i" } };
    } else if (username) {
      query = { username: { $regex: username, $options: "i" } };
    } else if (idUser) {
      query = { idUser: { $regex: idUser, $options: "i" } };
    }

    const searchStaff = await UserSchema.find(query);
    const userIds = searchStaff.map((user) => user._id);

    // // Lấy thông tin PaymentSchema dựa trên userIds
    const paymentInfo = await PaymentSchema.find({ userId: { $in: userIds } });
    const usersWithPaymentInfo = searchStaff.map((user) => {
      const userPaymentInfo = paymentInfo.find(
        (info) => info.userId.toString() === user._id.toString()
      );

      return {
        ...user.toObject(),
        bankName: userPaymentInfo ? userPaymentInfo.bankName : null,
        banKNumber: userPaymentInfo ? userPaymentInfo.accountNumber : null,
      };
    });
    return res.status(200).json(usersWithPaymentInfo);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deleteStaff = async (req, res) => {
  try {
    const { userId } = req.params;
    const checkUser = await UserSchema.findOne({ _id: userId })
    if (checkUser.isAdmin === true) {
      return res.status(400).json({
        ok: false,
        errMessage: "Không thể xoá",
      });
    }
    const user = await UserSchema.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        ok: false,
        errMessage: "Người dùng không tồn tại",
      });
    }
    return res.status(200).json({
      ok: true,
      message: "Người dùng đã được xoá thành công!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        errMessage: "Token không hợp lệ hoặc người dùng không xác thực.",
      });
    }
    const updatedData = {};
    const userId = req.user ? req.user.id : null;
    if (req.body.name) {
      updatedData.name = req.body.name;
    }
    if (req.body.address) {
      updatedData.address = req.body.address;
    }
    if (req.files && req.files[0] && req.files[0].path) {
      updatedData.avatar = req.files[0].path;
    }
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        ok: false,
        errMessage: "Không có dữ liệu để cập nhật.",
      });
    }
    const user = await UserSchema.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        errMessage: "Không tìm thấy người dùng.",
      });
    }

    // user.isAdmin = undefined;
    // user.isStaff = undefined;
    // user.password = undefined;
    // user.__v = undefined;
    await user.save();
    res.status(200).json({
      ok: true,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      errMessage: "Lỗi trong quá trình lấy thông tin người dùng.",
    });
  }
};

const getUserWithMail = async (req, res) => {
  const { username } = req.body;
  await User.getUserWithMail(username, (err, result) => {
    if (err) return res.status(404).send(err);

    const dataTransferObject = {
      name: result.name,
      avatar: result.avatar,
      username: result.username,
      color: result.color,
      username: result.username,
    };
    return res.status(200).send(dataTransferObject);
  });
};

const updateStaff = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedData = {};
    if (req.body.name) {
      updatedData.name = req.body.name;
    }
    if (req.files && req.files[0] && req.files[0].path) {
      updatedData.avatar = req.files[0].path;
    }
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        ok: false,
        errMessage: "Không có dữ liệu để cập nhật.",
      });
    }
    const user = await UserSchema.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    await user.save();
    user.password = undefined;
    return res.status(201).json({
      ok: true,
      message: "Cập nhật thành công!",
      user: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

const createUser = async (req, res) => {
  // const images_url = req.files.map((image) => image.path);
  const images_url = req.files[0].path;
  const salt = bcrypt.genSaltSync(10);
  const newUser = new UserSchema({
    name: req.body.name,
    username: req.body.username,
    address: req.body.address,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
    avatar: images_url,
    isAdmin: req.body.isAdmin,
  });
  if (req.user.isAdmin !== true) {
    return res.status(403).json({ message: "Bạn không phải admin" });
  }
  await newUser.save((err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    user.password = undefined;
    return res.status(200).json({
      ok: true,
      message: "Xác thực quyền admin thành công",
      user,
    });
  });
};

module.exports = {
  register,
  login,
  deleteStaff,
  searchStaff,
  getAllUser,
  getUserWithMail,
  updateProfile,
  // updateUser,
  updateStaff,
  createUser,
  getUserProfile,
  resetPassword,
  registerAdmin,
  referralCode,
};
