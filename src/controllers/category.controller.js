const CategorySchema = require("../models/category.model");
const ProductSchema = require("../models/product.model");
const slugify = require("slugify");

const createCategory = async (req, res) => {
  try {
    const { nameCategory } = req.body;
    const slugCategory = slugify(nameCategory, { lower: true });
    const finalSlug = `${slugCategory}`;
    const createCategory = await CategorySchema.create({ nameCategory, slugCategory: finalSlug });
    return res.status(200).json(createCategory);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const getCategory = async (req, res) => {
  try {
    const searchCategory = await CategorySchema.find();
    return res.status(200).json(searchCategory);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getAllCategoryProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const slugCategory = req.query.slugCategory;
    const categories = await CategorySchema.find({slugCategory: slugCategory});

    if (!categories) {
      return res.status(404).json({ msg: 'Không có danh mục nào tồn tại' });
    }
    const categoryProductList = [];

    for (const category of categories) {
      const categoryId = category._id;
      const productsInCategory = await ProductSchema.find({ category: categoryId })
        .skip(skip)
        .limit(limit)
        .sort({ __v: -1 });

      const countProductsInCategory = await ProductSchema.countDocuments({ category: categoryId });

      categoryProductList.push({
        category: category.nameCategory,
        page: page,
        limit: limit,
        count: countProductsInCategory,
        products: productsInCategory,
      });
    }

    return res.status(200).json(categoryProductList);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Lỗi server' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;
    for (const deId of id) {
      const category = await CategorySchema.findById(deId);
      if (!category) {
        return res.status(404).json({ msg: 'Danh mục không tồn tại' });
      }
      await ProductSchema.deleteMany({ category: deId });
      await CategorySchema.deleteOne({ _id: deId });
    }
    return res.status(200).json("Đã xóa xong !");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Lỗi server' });
  }
};
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId; 
    const category = await CategorySchema.findById(categoryId);
    if (!category) {
      return res.status(404).json({ msg: 'Danh mục không tồn tại' });
    }
    category.nameCategory = req.body.nameCategory;
    const updatedCategory = await category.save();
    const products = await ProductSchema.find({ category: updatedCategory._id });

    return res.status(200).json({
      category: updatedCategory,
      products: products,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Lỗi server' });
  }
};

const searchCategory = async (req, res) => {
  try {
    const { nameCategory } = req.query;
    let query = {};

    if (nameCategory) {
      query = { nameCategory: { $regex: nameCategory, $options: "i" } };
    }

    const searchProduct = await CategorySchema.find(query);

    return res.status(200).json(searchProduct);
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  createCategory,
  getAllCategoryProduct,
  getCategory,
  searchCategory,
  updateCategory,
  deleteCategory
};
