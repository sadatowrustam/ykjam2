const express = require('express');
const {
    addEtrap,
    editEtrap,
    deleteEtrap
} = require('../../../controllers/admin/etrapsControllers');
const {
    getAllEtraps,
} = require('../../../controllers/public/etrapsControllers');
const router = express.Router();
router.get('/', getAllEtraps);
router.post('/add', addEtrap);
router.patch('/:id', editEtrap);
router.post('/delete/:id', deleteEtrap);

module.exports = router;