const userController = require("../controllers/userController");
const router = require("express").Router();
const verifyToken = require('../utils/middleware');
const _const = require('../config/constant');
const middleware = require('../utils/middleware');

router.put('/:id', verifyToken.checkLogin, userController.updateUser);
router.put('/change-role/:id', verifyToken.checkLogin, userController.changeUserRole);
router.put('/change_password/:id', verifyToken.checkLogin, userController.changePassword);
router.get("/profile/:id", userController.getProfileById);
router.get("/get-mentor", userController.getMentor);
router.post('/search', userController.getAllUser);
router.get('/profile', userController.getProfile);
router.get("/searchByEmail", verifyToken.checkLogin, userController.searchUserByEmail);

router.post('/', verifyToken.checkLogin, userController.createUser);
router.delete("/:id", verifyToken.checkLogin, userController.deleteUser);

module.exports = router;
