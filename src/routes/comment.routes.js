const express = require("express");
const commentController = require("../controllers/comment.controller");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

router.post("/create", commentController.postComment);
router.get("/get-all-comment", commentController.getAllComent);
router.post("/replies", commentController.repComments);
router.post("/rep-comment", verifyToken, commentController.repComment);
router.get("/search", verifyToken, commentController.searchComent);
router.delete("/delete", verifyToken, commentController.deleteComent);

module.exports = router;
