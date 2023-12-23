const express = require("express");
const walletController = require("../controllers/wallet.controller");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

router.post("/add", verifyToken, walletController.addMoneyToWallet);
router.post("/withdraw", verifyToken, walletController.withdrawMoneyToWallet);
router.get(
  "/all-history",
  verifyToken,
  authAdmin,
  walletController.getHistoryWallet
);
router.get(
  "/history-user",
  verifyToken,
  walletController.getHistoryWalletbyUser
);
router.patch(
  "/update-history",
  // verifyToken,
  // authAdmin,
  walletController.updateHistory
);
router.patch("/take-oder", verifyToken, walletController.takeOder);
router.get("/get-take-oder", verifyToken, walletController.showTakeOrder);
router.get("/get-wallet", verifyToken, walletController.getWallet);
router.patch("/block-frize", verifyToken, authAdmin, walletController.frizes);
router.patch("/open-frize", verifyToken, authAdmin, walletController.openBlock);
router.get("/all-inf", verifyToken, authAdmin, walletController.getAll)

module.exports = router;
