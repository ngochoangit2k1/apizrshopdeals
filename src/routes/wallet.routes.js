const express = require("express");
const walletController = require("../controllers/wallet.controller");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

router.post("/add", verifyToken, walletController.addPoints);
router.post("/withdraw", verifyToken, walletController.withdrawMoneyToWallet);
router.get(
  "/all-history",
  verifyToken,
  // authAdmin,
  walletController.getHistoryAddPoints
);
router.get(
  "/admin-all-history",
  verifyToken,
  // authAdmin,
  walletController.historywithdrawWalletAdmin
);
router.get(
  "/user-point-history",
  verifyToken,
  walletController.getHistoryAddPointUser
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
router.patch("/open-frize", verifyToken, authAdmin, walletController.openBlock);
router.get("/all-inf", verifyToken, authAdmin, walletController.getAll)
router.get("/get-bank-name", walletController.showTakeOrder);

module.exports = router;
