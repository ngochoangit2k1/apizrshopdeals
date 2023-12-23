const express = require("express");
const router = express.Router();
const codeRamdomController = require("../controllers/codeRandom.controller")

// router.get("/get-order", orderController.getAllOrder);
router.get("/create-code", codeRamdomController.createClientCode);
// router.post("/create", randomController.createRandomOrder);
// router.patch("/update/:orderId", upload.Image('image'), orderController.updateOrder);
// router.get("/search", orderController.searchOrder);
// router.delete("/delete/:orderId", orderController.deleteOrder);

module.exports = router;
