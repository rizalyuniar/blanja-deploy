const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categorys');
const {validate} = require('../middleware/common')
const {protect} = require('../middleware/auth')

router.get("/", protect, categoryController.getAllCategory);
// create
router.post("/", protect, categoryController.createCategory);
// memanggil data secara spesifik sesuai id
router.get("/:id", protect, categoryController.getDetailCategory);
// update
router.put("/:id", protect, categoryController.updateCategory);
// delete
router.delete("/:id", protect, categoryController.deleteCategory);

module.exports = router