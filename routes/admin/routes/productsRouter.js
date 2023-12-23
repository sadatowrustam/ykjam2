const express = require('express');
const {
    addProduct,
    editProduct,
    uploadProductImage,
    deleteProduct,
    editProductStatus,
    getAllActiveProducts,
    getOneProduct,
    addSize,
    deleteProductImage,
    editProductRecommendation,
    addFromExcel,
    uploadExcel,
    uploadZip
} = require('../../../controllers/admin/productsControllers');
const router = express.Router();

router.get('/', getAllActiveProducts);
router.get("/:id", getOneProduct)
router.post("/add", addProduct)
router.post("/add/size/:id", addSize)
router.post("/add-excel",uploadExcel)
router.post("/add-zip",uploadZip)
router.post("/finish-excel",addFromExcel)
router.patch('/:id', editProduct);
router.post('/isActive', editProductStatus);
router.post('/isRecommended', editProductRecommendation);
router.post('/delete/:id', deleteProduct);
router.post('/upload-image/:id', uploadProductImage);
router.post("/delete/image/:id", deleteProductImage)
module.exports = router;
