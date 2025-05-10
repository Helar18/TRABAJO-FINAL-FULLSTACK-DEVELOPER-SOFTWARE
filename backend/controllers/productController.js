const productModel = require('../models/productModel');

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
};

// Agregar producto
const addProduct = async (req, res) => {
  const { name, price, stock, category } = req.body;
  if (!name || !price || !stock || !category) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }
  try {
    const result = await productModel.addProduct({ name, price, stock, category });
    res.status(201).json({ message: 'Producto agregado correctamente', result });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar producto', error });
  }
};

// Actualizar producto
const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;

  try {
    const result = await productModel.updateProduct(id, { name, price, stock, category });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error });
  }
};

// Eliminar producto
const removeProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await productModel.deleteProduct(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error });
  }
};

module.exports = {
  getProducts,
  addProduct,
  editProduct,
  removeProduct,
};
