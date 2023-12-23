const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const {verifyToken} = require("../middlewares/auth");

router.post('/create', contactController.postContact);
router.get('/get-all-contact', contactController.getAllContact);
router.get('/search', verifyToken, contactController.getContact);
router.delete('/delete', verifyToken, contactController.deleteContact);

module.exports = router;
