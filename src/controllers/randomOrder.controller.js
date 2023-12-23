// const BrandSchema = require("../models/brand.model");
const ProductSchema = require("../models/product.model");
const RandomSchema = require("../models/randomOrder.model");

const createRandomProduct = async (req, res) => {
  try {
    const findProduct = await ProductSchema.find();
    if (findProduct) {
      const randomIndex = Math.floor(Math.random() * findProduct.length)
      const randomElement = findProduct[randomIndex]
      console.log(randomElement)
      const randomId = new RandomSchema({
       
        idRandom: randomElement._id, 
      });
      // console.log(randomId)
      await randomId.save();
      return res.status(200).json(randomId);
    } else {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm nào.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Lỗi server.' });
  }
};




module.exports = {
  createRandomProduct,
};
