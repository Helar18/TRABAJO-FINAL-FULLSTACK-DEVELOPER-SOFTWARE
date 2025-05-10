const express = require('express');
const router = express.Router();
const {
  getProducts,
  addProduct,
  editProduct,
  removeProduct
} = require('../controllers/productController');

// Rutas CRUD
router.get('/', getProducts);              // Obtener todos
router.post('/', addProduct);              // Crear
router.put('/:id', editProduct);           // Actualizar
router.delete('/:id', removeProduct);      // Eliminar

module.exports = router;
