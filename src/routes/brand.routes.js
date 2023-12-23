const express = require("express");
const brandController = require("../controllers/brand.controller");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

router.post("/create", brandController.createBrand);
router.get("/get-brand", brandController.getBrand);
router.get("/get-all-brand", brandController.getAllBrandProduct);
router.delete("/delete", verifyToken, brandController.deleteBrand);
router.patch("/update/:brandId", verifyToken, brandController.updateBrand);
router.get("/search",  brandController.searchBrand);

module.exports = router;
