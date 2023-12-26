const express = require("express");
const upload = require("../middlewares/upload");
const orderController = require("../controllers/order.controller");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();


router.post("/create", verifyToken, orderController.createOrder);

module.exports = router;
