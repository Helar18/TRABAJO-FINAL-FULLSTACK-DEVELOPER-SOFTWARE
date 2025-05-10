const express = require('express');
const router = express.Router();
const { getCompanyInfo, updateCompanyInfo } = require('../controllers/companyController');

// GET: Obtener info
router.get('/', getCompanyInfo);

// PUT: Actualizar empresa
router.put('/:id', updateCompanyInfo);

module.exports = router;
