const express = require("express");
const router = express.Router();
const codeRamdomController = require("../controllers/codeRandom.controller");

// router.get("/get-order", orderController.getAllOrder);
router.get("/create-client-code", codeRamdomController.createClientCode);
router.get("/get-client-code", codeRamdomController.getClientCode);
router.get("/get-client-new-code", codeRamdomController.getNewClientCode);

router.get("/create-fashion-code", codeRamdomController.createFashionCode);
router.get("/get-fashion-code", codeRamdomController.getFashionCode);
router.get("/get-fashion-new-code", codeRamdomController.getNewFashionCode);

router.get("/create-product-code", codeRamdomController.createProductCode);
router.get("/get-product-code", codeRamdomController.getProductCode);
router.get("/get-product-new-code", codeRamdomController.getNewProductCode);

// router.post("/create", randomController.createRandomOrder);
// router.patch("/update/:orderId", upload.Image('image'), orderController.updateOrder);
// router.get("/search", orderController.searchOrder);
// router.delete("/delete/:orderId", orderController.deleteOrder);

module.exports = router;
