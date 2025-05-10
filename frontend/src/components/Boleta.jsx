import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const Boleta = ({
  cliente = '---',
  dni = '---',
  productos = [],
  totalVenta = 0,
  montoPago = 0,
  vuelto = 0,
  metodoPago = '',
}) => {
  const [numeroBoleta, setNumeroBoleta] = useState('0001');
  const [nombreTienda, setNombreTienda] = useState('Mi Tienda');
  const [direccionTienda, setDireccionTienda] = useState('');
  const [telefonoTienda, setTelefonoTienda] = useState('');
  const [atendidoPor, setAtendidoPor] = useState('---');

  const subtotal = totalVenta / 1.18;
  const igv = totalVenta - subtotal;

  const fecha = new Date();
  const fechaStr = fecha.toLocaleDateString();
  const horaStr = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    const actual = parseInt(localStorage.getItem('boletaNumero') || '1', 10);
    if (productos.length > 0) {
      localStorage.setItem('boletaNumero', (actual + 1).toString());
    }
    setNumeroBoleta(actual.toString().padStart(4, '0'));

    getTiendaInfo().then(data => {
      setNombreTienda(data.nombre || 'Tienda');
      setDireccionTienda(data.direccion || '');
      setTelefonoTienda(data.telefono || '');
    });

    const vendedor = sessionStorage.getItem('userName') || 'Desconocido';
    setAtendidoPor(vendedor);
  }, [productos]);

  const getTiendaInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/company');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener la tienda:', error);
      return { nombre: 'Tienda', direccion: '', telefono: '' };
    }
  };

  return (
    <Box
      id="boleta-para-pdf"
      sx={{
        width: 300,
        backgroundColor: '#fff',
        fontFamily: '"Courier New", monospace',
        fontSize: 12,
        border: '1px solid #000',
        p: 2,
        lineHeight: 1.6,
      }}
    >
      <Typography align="center" fontWeight="bold" sx={{ fontSize: 13, textTransform: 'uppercase', mb: 2 }}>
        ============================<br />
        {nombreTienda.toUpperCase()}<br />
        BOLETA DE VENTA<br />
        ============================
      </Typography>

      <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Boleta N°: {numeroBoleta}</Typography>
      <Typography sx={{ fontSize: 12 }}>Fecha: {fechaStr}</Typography>
      <Typography sx={{ fontSize: 12 }}>Hora: {horaStr}</Typography>
      <Typography sx={{ fontSize: 12 }}>Cliente: {cliente}</Typography>
      <Typography sx={{ fontSize: 12 }}>DNI: {dni}</Typography>
      <Typography sx={{ fontSize: 12, mt: 1 }}>-------------------------------------------</Typography>

      {productos.length === 0 ? (
        <Typography sx={{ fontSize: 12 }}>No hay productos</Typography>
      ) : (
        productos.map((p, i) => {
          const cantidad = Number(p.cantidad) || 0;
          const precio = parseFloat(p.price) || 0;
          const total = cantidad * precio;

          return (
            <Box key={i} sx={{ mb: 1 }}>
              <Typography sx={{ fontSize: 12 }}>Cant. : {cantidad}</Typography>
              <Typography sx={{ fontSize: 12 }}>Producto : {p.name || 'Producto sin nombre'}</Typography>
              <Typography sx={{ fontSize: 12 }}>P.Unit : S/.{precio.toFixed(2)}</Typography>
              <Typography sx={{ fontSize: 12 }}>Total : S/.{total.toFixed(2)}</Typography>
              <hr style={{ borderTop: '1px solid #aaa' }} />
            </Box>
          );
        })
      )}

      <Typography sx={{ fontSize: 12, mt: 1 }}>-------------------------------------------</Typography>

      <Typography sx={{ fontSize: 12 }}>Subtotal: S/.{subtotal.toFixed(2)}</Typography>
      <Typography sx={{ fontSize: 12 }}>IGV (18%): S/.{igv.toFixed(2)}</Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Total a Pagar: S/.{totalVenta.toFixed(2)}</Typography>
      <Typography sx={{ fontSize: 12 }}>Método de Pago: {metodoPago || '---'}</Typography>
      <Typography sx={{ fontSize: 12 }}>Vuelto: S/.{vuelto.toFixed(2)}</Typography>
      <Typography sx={{ fontSize: 12 }}>Atendido por: {atendidoPor}</Typography>

      <Typography align="center" mt={2} sx={{ fontSize: 12, fontWeight: 'bold' }}>
        ¡Gracias por su compra!
      </Typography>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontSize: 10 }}>
          Dirección: {direccionTienda} | Teléfono: {telefonoTienda}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 10 }}>
          www.{nombreTienda.toLowerCase().replace(/\s+/g, '')}.com
        </Typography>
      </Box>
    </Box>
  );
};

export default Boleta;
