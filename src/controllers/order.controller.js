const OrderSchema = require("../models/order.model");
const WalletSchema = require("../models/wallet.model");
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

//Product
const createProductCode = async (req, res) => {
    try {
        const random = generateRandomString(5);
        const clientCode = await ProductSchema.create({
            randomNumber: random,
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
        return res.status(200).json(getClientCode);
    } catch (error) {
        return res.status(400).json(err);
    }
};

const getNewProductCode = async (req, res) => {
    try {
        const getProductCode = await ProductSchema.find()
            .sort({ createdAt: -1 })
            .limit(1);
        return res.status(200).json(getClientCode);
    } catch (error) {
        return res.status(400).json(err);
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
//Product
const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const countNum = req.body
        const {codeOrder, randomNumber} = req.body;
        const wallet = await WalletSchema.findOne({ userId: userId })
        const totalmount = wallet.totalAmount
        if (totalmount > 0 && countNum > 0) {
            await OrderSchema.create({
                userId: userId,
                countNum: countNum,
                codeOrder: codeOrder,
                randomNumber: randomNumber
            });
            const updateMount = await WalletSchema.findOne({ userId: userId })
            const a = updateMount.totalAmount - countNum
            await WalletSchema.findByIdAndUpdate({ userId: userId}, {totalAmount: a})
        } else {
            return res.status(400).json(err);
        }
        
        // console.log(clientCode);
    } catch (error) {
        return res.status(400).json(err);
    }
};
module.exports = {
    createOrder,
    createProductCode,
    getNewProductCode,
    getProductCode,
};
