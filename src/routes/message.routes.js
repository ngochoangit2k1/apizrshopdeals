const express = require("express");
const MessageController = require("../controllers/message.controller");
const { verifyToken } = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.post('/create',verifyToken, MessageController.postMessage);
router.get('/get-message', verifyToken,MessageController.getMessagebyUser);
router.get('/get-message-admin', verifyToken,MessageController.getMessagebyAdmin);

router.get('/get-all-message',verifyToken,authAdmin, MessageController.getAllMessage);
router.get('/search', verifyToken, MessageController.getMessage);
router.delete('/delete', verifyToken, MessageController.deleteMessage);

module.exports = router;
