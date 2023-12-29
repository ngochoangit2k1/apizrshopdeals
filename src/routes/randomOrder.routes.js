const express = require("express");
const router = express.Router();
const codeRandomController = require("../controllers/codeRandom.controller");

// router.get("/get-order", orderController.getAllOrder);
router.get("/create-client-code", codeRandomController.createClientCode);
router.get("/get-client-code", codeRandomController.getClientCode);
router.get("/get-client-new-code", codeRandomController.getNewClientCode);

router.get("/create-fashion-code", codeRandomController.createFashionCode);
router.get("/get-fashion-code", codeRandomController.getFashionCode);
router.get("/get-fashion-new-code", codeRandomController.getNewFashionCode);

router.get("/create-product-code", codeRandomController.createProductCode);
router.get("/get-product-code", codeRandomController.getProductCode);
router.get("/get-product-new-code", codeRandomController.getNewProductCode);

router.get("/get-random", codeRandomController.generateRandomStrings)

router.patch('/setting-random-product', codeRandomController.updateConfigRandomProduct)
router.patch('/setting-random-faction', codeRandomController.updateConfigRandomFaction)

// router.post("/create", randomController.createRandomOrder);
// router.patch("/update/:orderId", upload.Image('image'), orderController.updateOrder);
// router.get("/search", orderController.searchOrder);
// router.delete("/delete/:orderId", orderController.deleteOrder);

module.exports = router;
