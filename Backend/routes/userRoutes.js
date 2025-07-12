const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authinticate = require("../middlewares/authinticate");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/home", authinticate, userController.home);
router.post('/refresh', userController.refresh)

module.exports = router;
