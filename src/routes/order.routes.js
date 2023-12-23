const express = require("express");
const upload = require("../middlewares/upload");
const orderController = require("../controllers/order.controller");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();


router.get("/get-order", orderController.getAllOrder);
// router.get("/get-order-by-category", orderController.getOrdersByCategory);
router.post("/create",upload.Image('image'), orderController.createOrder);
router.patch("/update/:orderId", upload.Image('image'), orderController.updateOrder);
router.get("/search", orderController.searchOrder);
router.delete("/delete/:orderId", orderController.deleteOrder);

module.exports = router;
