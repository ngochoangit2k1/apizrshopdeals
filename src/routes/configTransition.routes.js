const express = require("express");
const configTransitiontController = require("../controllers/configTransition.controller");
const { verifyToken } = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.get("/get-transition", configTransitiontController.getTransactionsSettings);
router.patch("/setting",verifyToken, authAdmin, configTransitiontController.transitiontSetting);

router.get("/get-countdown",configTransitiontController.getCountdownSettings);
router.patch("/setting-countdown",verifyToken,authAdmin,  configTransitiontController.countdownSettings);
module.exports = router;