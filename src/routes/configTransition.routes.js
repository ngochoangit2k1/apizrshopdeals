const express = require("express");
const configTransitiontController = require("../controllers/configTransition.controller");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

router.post("/create",  configTransitiontController.createTransitiontSetting);
router.patch("/update",  configTransitiontController.createTransitiontSetting);
router.get("/get-transition", configTransitiontController.getTransactionsSettings);
router.patch("/setting",  configTransitiontController.transitiontSetting);


module.exports = router;