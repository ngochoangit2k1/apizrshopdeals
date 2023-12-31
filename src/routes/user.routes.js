const express = require("express");
const userController = require("../controllers/user.controller");
const upload = require("../middlewares/upload");
const authAdmin = require("../middlewares/authAdmin");
const authStaff = require("../middlewares/authStaff");
const {verifyToken} = require("../middlewares/auth");
const router = express.Router();
//Admin và nhân viên
router.get('/profile', verifyToken, userController.getUserProfile);
router.patch('/update', verifyToken, upload.Avatar('avatar'), userController.updateProfile)
// router.post('/register-staff', userController.register);
//Admin
router.post('/register-staff',verifyToken, authAdmin,  userController.registerAdmin);
router.get('/get-all-staff', verifyToken, userController.getAllUser);
router.get('/search-staff',userController.searchStaff);
router.delete('/:userId', verifyToken, authAdmin, userController.deleteStaff);
router.patch('/:userId', verifyToken, authAdmin, upload.Avatar('avatar'), userController.updateStaff);
router.get('/referral-code',verifyToken, userController.referralCode)
router.patch('/update-role/:id', verifyToken, authAdmin, userController.updateRoleStaff)

// router.post('/get-user-by-email', userController.getUserWithMail);
// router.patch('/:userId', upload.Avatar('avatar'), userController.updateUser);
// router.post('/create-user',authAdmin, upload.Avatar('avatar'), userController.createUser);
module.exports = router;
