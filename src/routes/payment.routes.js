const express = require("express");
const paymentController = require("../controllers/payment.controller");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();


router.get("/get-payment", paymentController.getAllPayment);
router.get("/info-bank-user", paymentController.getBankByUser)
router.post("/create",  paymentController.postPayment);
router.patch("/update/:paymentId", verifyToken, paymentController.updatePayment);
router.get("/search", verifyToken, paymentController.getPayment);
router.delete("/delete/:paymentId", verifyToken, paymentController.deletePayment);

module.exports = router;
