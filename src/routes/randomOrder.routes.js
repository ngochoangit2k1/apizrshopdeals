const express = require("express");
const randomController = require("../controllers/randomOrder.controller");
const router = express.Router();


// router.get("/get-order", orderController.getAllOrder);
// router.get("/get-order-by-category", orderController.getOrdersByCategory);
router.post("/create", randomController.createRandomOrder);
// router.patch("/update/:orderId", upload.Image('image'), orderController.updateOrder);
// router.get("/search", orderController.searchOrder);
// router.delete("/delete/:orderId", orderController.deleteOrder);

module.exports = router;
