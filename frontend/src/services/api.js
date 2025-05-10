import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Obtener encabezados de autenticación desde sessionStorage
const getAuthHeaders = () => {
  const token = sessionStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Función auxiliar para manejar solicitudes a la API
const apiRequest = async (method, url, data = null, config = {}) => {
  try {
    const response = await axios({
      method,
      url: `${API_URL}${url}`,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`Error en la solicitud a ${url}:`, error.response?.data || error.message);
    throw error;
  }
};

// ======================= Auth =======================

// Iniciar sesión
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    sessionStorage.setItem('authToken', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error.response?.data || error.message);
    throw error;
  }
};

// ======================= Empleados =======================

export const getEmployees = async () => {
  return apiRequest('GET', '/employees', null, { headers: getAuthHeaders() });
};

export const addEmployee = async (employee) => {
  return apiRequest('POST', '/employees', employee, { headers: getAuthHeaders() });
};

export const editEmployee = async (id, updatedEmployee) => {
  return apiRequest('PUT', `/employees/${id}`, updatedEmployee, { headers: getAuthHeaders() });
};

export const deleteEmployee = async (id) => {
  return apiRequest('DELETE', `/employees/${id}`, null, { headers: getAuthHeaders() });
};

// ======================= Empresa =======================

export const getCompanyInfo = async () => {
  return apiRequest('GET', '/company', null, { headers: getAuthHeaders() });
};

export const updateCompanyInfo = async (id, updatedCompany) => {
  return apiRequest('PUT', `/company/${id}`, updatedCompany, { headers: getAuthHeaders() });
};

// ======================= Productos =======================

export const getProducts = async () => {
  return apiRequest('GET', '/products', null, { headers: getAuthHeaders() });
};

export const getProductById = async (id) => {
  return apiRequest('GET', `/products/${id}`, null, { headers: getAuthHeaders() });
};

export const addProduct = async (product) => {
  return apiRequest('POST', '/products', product, { headers: getAuthHeaders() });
};

export const updateProduct = async (id, updatedProduct) => {
  return apiRequest('PUT', `/products/${id}`, updatedProduct, { headers: getAuthHeaders() });
};

export const deleteProduct = async (id) => {
  return apiRequest('DELETE', `/products/${id}`, null, { headers: getAuthHeaders() });
};

// ======================= Ventas =======================

// Registrar venta
export const registrarVenta = async (venta) => {
  if (
    !venta ||
    !venta.cliente?.nombre ||
    !venta.cliente?.dni ||
    !Array.isArray(venta.productos) ||
    venta.productos.length === 0 ||
    venta.total == null ||
    venta.pago == null ||
    !venta.metodoPago
  ) {
    throw new Error('Faltan datos obligatorios');
  }

  // Se asegura que los campos coincidan con el backend
  const ventaData = {
    cliente: {
      nombre: venta.cliente.nombre,
      dni: venta.cliente.dni
    },
    productos: venta.productos.map((producto) => ({
      id: producto.producto_id,
      cantidad: producto.cantidad,
      precio: producto.precio_unitario
    })),
    total: venta.total,
    pago: venta.pago,
    metodoPago: venta.metodoPago,
    vuelto: venta.vuelto || 0 // Si no hay vuelto, lo inicializa en 0
  };

  console.log(ventaData);
  return apiRequest('POST', '/ventas', ventaData, { headers: getAuthHeaders() });
};

// empresa-ventas\frontend\src\services\api.js

// Obtener historial de ventas
export const getHistorialVentas = async () => {
  return apiRequest('GET', '/ventas/historial', null, { headers: getAuthHeaders() });
};


