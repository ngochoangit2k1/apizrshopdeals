const express = require("express");
const upload = require("../middlewares/upload");
const paymentAdmin = require("../controllers/paymentAdmin.controller");
const { verifyToken } = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.post("/create", verifyToken,upload.Image('image'), paymentAdmin.createPaymentAdmin);

router.patch(
  "/setting-pay-admin",
  verifyToken,
  // authAdmin,
  upload.Image("image"),
  paymentAdmin.update
);

router.get("/", verifyToken, paymentAdmin.get);
router.get("/user", verifyToken,paymentAdmin.getUser);

router.delete("/delete", verifyToken,authAdmin, paymentAdmin.deletePayment)
module.exports = router;
