const authController = require("../controllers/authController");
const router = require("express").Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/activate/:token", authController.activateUser);

module.exports = router;