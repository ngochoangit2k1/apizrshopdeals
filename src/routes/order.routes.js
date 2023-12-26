const express = require("express");
const upload = require("../middlewares/upload");
const orderController = require("../controllers/order.controller");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();


router.post("/create", verifyToken, orderController.createOrder);

router.get("/get-all", verifyToken, orderController.HistoryAllOrders)
router.get("/get-history-user", verifyToken, orderController.HistoryOrdersByUser)
router.patch("/update-history-user", verifyToken, orderController.UpdateStatusHistory)

module.exports = router;
