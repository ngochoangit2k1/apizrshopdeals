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
const currentTime = new Date();
const day = currentTime.getDate().toString().padStart(2, "0");
const month = (currentTime.getMonth() + 1).toString().padStart(2, "0"); // Lưu ý: Tháng trong JavaScript bắt đầu từ 0
const year = currentTime.getFullYear().toString();
//Fashion

const createFashionCode = async (req, res) => {
  try {
    const random = generateRandomString(5);
    const getClientCode = await FashionSchema.find()
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(getClientCode[0].fashionCode)
    const formattedDate = day + month + year + (getClientCode[0].fashionCode +1);
    console.log(formattedDate);
    const clientCode = await FashionSchema.create({
      randomNumber: random,
      fashionPlus:formattedDate
    });
    console.log(clientCode);
  } catch (error) {
    console.log(error);
  }
};

const getFashionCode = async (req, res) => {
  try {
    const getFashionCode = await FashionSchema.find()
      .sort({ createdAt: -1 })
      .limit(20);
    return res.status(200).json(getFashionCode);
  } catch (error) {
    return res.status(400).json(err);
  }
};

const getNewFashionCode = async (req, res) => {
  try {
    const getFashionCode = await FashionSchema.find()
      .sort({ createdAt: -1 })
      .limit(1);
    return res.status(200).json(getFashionCode);
  } catch (error) {
    return res.status(400).json(err);
  }
};

//Product
const createProductCode = async (req, res) => {
  try {
    const random = generateRandomString(5);
    const getClientCode = await ProductSchema.find()
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(getClientCode[0].productCode)
    const formattedDate = day + month + year + (getClientCode[0].productCode +1);
    const clientCode = await ProductSchema.create({
      randomNumber: random,
      productCodePlus:formattedDate
    });
    console.log(clientCode);
  } catch (error) {
    return res.status(400).json(err);
  }
};
const getProductCode = async (req, res) => {
  try {
    const getProductCode = await ProductSchema.find()
      .sort({ createdAt: -1 })
      .limit(20);
    return res.status(200).json(getProductCode);
  } catch (error) {
    return res.status(400).json(err);
  }
};

const getNewProductCode = async (req, res) => {
  try {
    const getProductCode = await ProductSchema.find()
      .sort({ createdAt: -1 })
      .limit(1);
    return res.status(200).json(getProductCode);
  } catch (error) {
    return res.status(400).json(err);
  }
};

//Client
const createClientCode = async (req, res) => {
  try {
    const random = generateRandomString(5);
    const getClientCode = await ClientSchema.find()
    .sort({ createdAt: -1 })
    .limit(1);
  console.log(getClientCode[0].clientCode)
  const formattedDate = day + month + year + (getClientCode[0].clientCode +1);
 const client =   await ClientSchema.create({
      randomNumber: random,
      clientCodePlus: formattedDate
    });

  } catch (error) {
    return res.status(400).json(error);
  }
};    

const getClientCode = async (req, res) => {
  try {
    const getClientCode = await ClientSchema.find()
      .sort({ createdAt: -1 })
      .limit(20);
    return res.status(200).json(getClientCode);
  } catch (error) {
    return res.status(400).json(err);
  }
};

const getNewClientCode = async (req, res) => {
  try {
    const getClientCode = await ClientSchema.find()
      .sort({ createdAt: -1 })
      .limit(1);
    return res.status(200).json(getClientCode);
  } catch (error) {
    return res.status(400).json(err);
  }
};
module.exports = {
  createClientCode,
  getClientCode,
  getNewClientCode,
  //
  createFashionCode,
  getFashionCode,
  getNewFashionCode,
  //
  createProductCode,
  getNewProductCode,
  getProductCode,
};
