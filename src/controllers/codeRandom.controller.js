const ClientSchema = require("../models/client.model");
const FashionSchema = require("../models/fashion.model");
const numberSchema = require("../models/numberCount.model");
const ProductSchema = require("../models/product.model");
const factionConfigSchema = require("../models/randomFashionConfig.model");
const productConfigSchema = require("../models/randomProductConfig.model");

const FactionId = "658e5993e6761d41d4e6170f";
const ProductId = "658e5994e6761d41d4e61711";

const generateRandomString = (length) => {
  const characters = "0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

const generateRandomStringEven = (length) => {
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  const sum = result.split("").reduce((acc, num) => acc + parseInt(num), 0);

  const lastDigit = (10 - (sum % 10)) % 10;

  result += lastDigit;

  return result;
};
const generateRandomStringOdd = (length) => {
  const characters = "0123456789";
  let result = "";

  for (let i = 0; i < length - 1; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  const sum = result.split("").reduce((acc, num) => acc + parseInt(num), 0);

  const lastDigit = (9 - (sum % 10)) % 10;
  result += lastDigit;

  return result;
};

const generateRandomStrings = async (req, res) => {
  try {
    const randomStrings = generateRandomStringEven(4);

    return res.json({ randomStrings });
  } catch (error) {
    return res.json(randomStrings);
  }
};

let currentTime = getCurrentTime();
function getCurrentTime() {
  return new Date();
}

let day;
let month;
let year;
let currentHour;
let currentMinutes;
let currentDayIndex;
let currentDay
function updateCurrentTime() {
  currentTime = getCurrentTime();
  day = currentTime.getDate().toString().padStart(2, "0");
  month = (currentTime.getMonth() + 1).toString().padStart(2, "0"); // Lưu ý: Tháng trong JavaScript bắt đầu từ 0
  year = currentTime.getFullYear().toString().slice(2);
  currentDayIndex = currentTime.getDay();
  currentHour = currentTime.getHours();
  currentMinutes = currentTime.getMinutes();
  const daysOfWeek = ["8", "2", "3", "4", "5", "6", "7"];
  currentDay = daysOfWeek[currentDayIndex];
}

const targetHour = 12;
const targetMinutes = 35;


//Fashion


const resetCount = async () => {
  try {
    await numberSchema.deleteMany({});

    await numberSchema.create({ number: 1 });
  } catch (error) {
    console.log(error);
  }
};

const createFashionCode = async (req, res) => {
  try {
    const configRandom = await factionConfigSchema.findOne({
      _id: FactionId,
    });
    let random;
    updateCurrentTime();

    if (configRandom.number === "0") {
      random = generateRandomString(5);
    } else if (configRandom.number === "1") {
      random = generateRandomStringEven(4);
    } else {
      random = generateRandomStringOdd(5);
    }

    const getClientCode = await numberSchema
      .find()
      .sort({ createdAt: -1 })
      .limit(1);

    let code;
 
    if (currentHour === targetHour && currentMinutes === targetMinutes) {
      resetCount();
    } else {
      const number = getClientCode[0].number + 1;
      await numberSchema.create({ number: number });

      code = getClientCode[0].number + 1;
    }
    const formattedDate = day + month + year + currentDay + code;
    const clientCode = await FashionSchema.create({
      randomNumber: random,
      fashionPlus: formattedDate,
    });
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
    const configRandom = await productConfigSchema.findOne({
      _id: ProductId,
    });
    updateCurrentTime();

    let random;
    if (configRandom.number === "0") {
      random = generateRandomString(5);
    } else if (configRandom.number === "1") {
      random = generateRandomStringEven(4);
    } else {
      random = generateRandomStringOdd(5);
    }
    const getClientCode = await numberSchema
      .find()
      .sort({ createdAt: -1 })
      .limit(1);

    let code;
    if (getClientCode.length === 0) {
      await numberSchema.create({ number: 1 });
      code = 1;
    } else {
      code = getClientCode[0].number + 1;
    }
    const formattedDate = day + month + year + currentDay + code;
    const clientCode = await ProductSchema.create({
      randomNumber: random,
      productCodePlus: formattedDate,
    });
  } catch (error) {
    console.log(error);
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
    const formattedDate =
      day + month + year + (getClientCode[0].clientCode + 1);
    const client = await ClientSchema.create({
      randomNumber: random,
      clientCodePlus: formattedDate,
    });
  } catch (error) {
    console.log(error);
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

const updateConfigRandomFaction = async (req, res) => {
  const { number } = req.body;
  try {
    await factionConfigSchema.findOneAndUpdate(
      { _id: FactionId },
      { number: number }
    );
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
const getConfigRandomFaction = async (req, res) => {
  try {
    const faction = await factionConfigSchema.findOne({ _id: FactionId });
    return res.status(200).json(faction);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
const updateConfigRandomProduct = async (req, res) => {
  const { number } = req.body;
  try {
    await productConfigSchema.findOneAndUpdate(
      { _id: ProductId },
      { number: number }
    );
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
const getConfigRandomProduct = async (req, res) => {
  const { number } = req.body;
  try {
    const product = await productConfigSchema.findOne({ _id: ProductId });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports = {
  generateRandomStrings,

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

  //
  getConfigRandomFaction,
  updateConfigRandomFaction,
  getConfigRandomProduct,
  updateConfigRandomProduct,
};
