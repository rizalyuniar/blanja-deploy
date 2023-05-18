const express = require('express');
const router = express.Router();
const userController = require('../controller/users');
const {protect} = require('../middleware/auth')

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refresh-token", userController.refreshToken);
router.get("/profile", protect, userController.profile);

router.post("/registerVerif", userController.registerVerif);
router.get("/verif/:id", userController.verifUser);

// create
// router.post("/", userController.createUser);
// // memanggil data secara spesifik sesuai id
// router.get("/:id", userController.getDetailUser);
// // update
// router.put("/:id", userController.updateUser);
// // delete
// router.delete("/:id", userController.deleteUser);

module.exports = router