const express = require('express');
const {
    getAllOrders,
    getOrderProducts,
    deleteOrderProduct,
    isRead,
    getDailyStats
} = require('../../../controllers/seller/ordersControllers');
const {changeOrderStatus}=require("../../../controllers/admin/ordersControllers")
const router = express.Router();

router.get('/', getAllOrders);
router.get("/isRead",isRead)
router.get("/daily",getDailyStats)
router.delete('/order-products/delete/:id', deleteOrderProduct);
router.get('/order-products/:id', getOrderProducts);
router.patch('/status/:id', changeOrderStatus);

module.exports = router;