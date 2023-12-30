const express = require("express");
const paymentController = require("../controllers/payment.controller");
const { verifyToken} = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();


router.get("/get-payment", paymentController.getAllPayment);
router.get("/info-bank-user", paymentController.getBankByUser)
router.post("/create",  paymentController.postPayment);
router.patch("/update", verifyToken, paymentController.updatePayment);
router.patch("/update/:userId", verifyToken, paymentController.updatePaymentAll);
router.get("/search", verifyToken, paymentController.getPayment);
router.delete("/delete/:paymentId", verifyToken, authAdmin,  paymentController.deletePayment);

module.exports = router;
