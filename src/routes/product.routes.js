const express = require("express");
const upload = require("../middlewares/upload");
const productController = require("../controllers/product.controller");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();


router.get("/get-all-product", productController.getAllProduct);
router.get("/get-detail-product", productController.getDetailProduct);
router.get("/get-product-by-category", productController.getProductsByCategory);
router.post("/create",  upload.Image('image'), productController.createProduct);
router.patch("/update/:productId",  upload.Image('image'), productController.updateProduct);
router.get("/search",  productController.searchProduct);
router.delete("/delete",  productController.deleteProduct);

module.exports = router;
