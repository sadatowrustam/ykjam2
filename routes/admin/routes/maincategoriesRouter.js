const express = require('express');
const router = express.Router()
const { addMainCategory, allMainCategories, updateMainCategory,uploadCategoryImage, deleteMainCategory } = require("../../../controllers/admin/maincategoryControllers");
const { deleteImage } = require('../../../controllers/admin/blogsControllers');

router.post("/", addMainCategory)
router.get("/", allMainCategories)
router.patch("/:id",updateMainCategory)
router.post("/delete/:id", deleteMainCategory)
router.post("/upload-image",uploadCategoryImage)
router.post("/delete-image/:image",deleteImage)
module.exports = router;