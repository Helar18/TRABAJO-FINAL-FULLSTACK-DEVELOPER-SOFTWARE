const db = require('../config/db');

// Obtener todos los productos
const getAllProducts = async () => {
  const [rows] = await db.execute('SELECT * FROM products');
  return rows;
};

// Agregar un producto
const addProduct = async ({ name, price, stock, category }) => {
  const [result] = await db.execute(
    'INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)',
    [name, price, stock, category]
  );
  return result;
};

// Actualizar un producto
const updateProduct = async (id, { name, price, stock, category }) => {
  const [result] = await db.execute(
    'UPDATE products SET name = ?, price = ?, stock = ?, category = ? WHERE id = ?',
    [name, price, stock, category, id]
  );
  return result;
};

// Eliminar un producto
const deleteProduct = async (id) => {
  const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
  return result;
};

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
