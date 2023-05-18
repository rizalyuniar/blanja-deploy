const express = require('express');
const router = express.Router();
const customerController = require('../controller/customers');
const {protect} = require('../middleware/auth')

router.post("/register", customerController.register);
router.post("/login", customerController.login);
router.post("/refresh-token", customerController.refreshToken);
router.get("/profile", protect, customerController.profile);

router.get("/", protect, customerController.getAllCustomer);
// create
// router.post("/", customerController.createCustomer);
// memanggil data secara spesifik sesuai id
router.get("/:id", protect, customerController.getDetailCustomer);
// update
router.put("/:id", protect, customerController.updateCustomer);
// delete
router.delete("/:id", protect, customerController.deleteCustomer);

module.exports = router