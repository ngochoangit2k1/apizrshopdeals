const express = require("express");
const categoryController = require("../controllers/category.controller");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

router.post("/create",  categoryController.createCategory);
router.get("/get-category", categoryController.getCategory);
router.get("/get-all-category", categoryController.getAllCategoryProduct);
router.delete("/delete", verifyToken, categoryController.deleteCategory);
router.patch("/update/:categoryId", verifyToken, categoryController.updateCategory);
router.get("/search", verifyToken, categoryController.searchCategory);

module.exports = router;
