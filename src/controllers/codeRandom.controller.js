const ClientSchema = require("../models/client.model");
const FashionSchema = require("../models/fashion.model");

const ProductSchema = require("../models/product.model");

const generateRandomString = (length) => {
    const characters = "0123456789";
    let result = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  };
const createFashionCode =  async (req, res) => {
    try {
        const random = generateRandomString(5)
        const clientCode = await ClientSchema.create({
            randomNumber: random
        })
        return res.status(200).json(clientCode)
    } catch (error) {
        return res.status(400).json(err);

    }
}

const createProductCode =  async (req, res) => {
    try {
        const random = generateRandomString(5)
        const clientCode = await ProductSchema.create({
            randomNumber: random
        })
        return res.status(200).json(clientCode)
    } catch (error) {
        return res.status(400).json(err);

    }
}


const createClientCode =  async (req, res) => {
    try {
        const random = generateRandomString(5)
        const clientCode = await FashionSchema.create({
            randomNumber: random
        })
        return res.status(200).json(clientCode)
    } catch (error) {
        return res.status(400).json(err);

    }
}

module.exports = {
    createClientCode,
    createFashionCode,
    createProductCode
};
