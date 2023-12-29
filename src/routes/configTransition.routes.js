const express = require("express");
const configTransitiontController = require("../controllers/configTransition.controller");
const { verifyToken } = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.post("/create", configTransitiontController.createTransitiontSetting);
router.patch("/update", configTransitiontController.updataTransitiontSetting);
router.get("/get", configTransitiontController.getSetting);
router.get(
  "/get-transition",
  configTransitiontController.getTransactionsSettings
);
router.patch(
  "/setting",
  verifyToken,
  authAdmin,
  configTransitiontController.transitiontSetting
);

router.get("/get-countdown", configTransitiontController.getCountdownSettings);
router.patch(
  "/setting-countdown",
  verifyToken,
  authAdmin,
  configTransitiontController.countdownSettings
);
router.post(
  "/create-withdraw",
  configTransitiontController.createMoneyConfigSetting
);

router.patch("/update-withdraw", configTransitiontController.updateConfigMoney);
router.get("/get-withdraw", configTransitiontController.getConfigMoney);
module.exports = router;
