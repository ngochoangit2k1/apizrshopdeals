const BrandSchema = require("../models/brand.model");
const ProductSchema = require("../models/product.model");
const slugify = require("slugify");

const createBrand = async (req, res) => {
  try {
    const { nameBrand } = req.body;
    const slugBrand = slugify(nameBrand, { lower: true });
    const finalSlug = `${slugBrand}`;
    const createBrand = await BrandSchema.create({ nameBrand, slugBrand: finalSlug });
    return res.status(200).json(createBrand);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const getBrand = async (req, res) => {
  try {
    const searchBrand = await BrandSchema.find();
    return res.status(200).json(searchBrand);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getAllBrandProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const slugBrand = req.query.slugBrand;
    const categories = await BrandSchema.find({slugBrand: slugBrand});

    if (!categories) {
      return res.status(404).json({ msg: 'Không có danh mục nào tồn tại' });
    }
    const brandProductList = [];

    for (const brand of categories) {
      const brandId = brand._id;
      const productsInBrand = await ProductSchema.find({ brand: brandId })
        .skip(skip)
        .limit(limit)
        .sort({ __v: -1 });

      const countProductsInBrand = await ProductSchema.countDocuments({ brand: brandId });

      brandProductList.push({
        brand: brand.nameBrand,
        page: page,
        limit: limit,
        count: countProductsInBrand,
        products: productsInBrand,
      });
    }

    return res.status(200).json(brandProductList);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Lỗi server' });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.body;
    for (const deId of id) {
      const brand = await BrandSchema.findById(deId);
      if (!brand) {
        return res.status(404).json({ msg: 'Danh mục không tồn tại' });
      }
      await ProductSchema.deleteMany({ brand: deId });
      await BrandSchema.deleteOne({ _id: deId });
    }
    return res.status(200).json("Đã xóa xong !");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Lỗi server' });
  }
};
const updateBrand = async (req, res) => {
  try {
    const brandId = req.params.brandId; 
    const brand = await BrandSchema.findById(brandId);
    if (!brand) {
      return res.status(404).json({ msg: 'Danh mục không tồn tại' });
    }
    brand.nameBrand = req.body.nameBrand;
    const updatedBrand = await brand.save();
    const products = await ProductSchema.find({ brand: updatedBrand._id });

    return res.status(200).json({
      brand: updatedBrand,
      products: products,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Lỗi server' });
  }
};

const searchBrand = async (req, res) => {
  try {
    const { nameBrand } = req.query;
    let query = {};

    if (nameBrand) {
      query = { nameBrand: { $regex: nameBrand, $options: "i" } };
    }

    const searchProduct = await BrandSchema.find(query);

    return res.status(200).json(searchProduct);
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  createBrand,
  getAllBrandProduct,
  getBrand,
  searchBrand,
  updateBrand,
  deleteBrand
};
