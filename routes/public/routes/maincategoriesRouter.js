const express = require('express');
const {
    getAllCategories,
    getCategorySeller,
} = require('../../../controllers/public/maincategoriesControllers');

const router = express.Router();

router.get('/', getAllCategories);
router.get('/sellers/:id', getCategorySeller);

module.exports = router;