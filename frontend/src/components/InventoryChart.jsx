import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, CircularProgress, IconButton, Button,
  MenuItem, Select, FormControl, InputLabel, Alert
} from '@mui/material';
import { Close, Download } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { getProducts } from '../services/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const InventoryChart = () => {
  const navigate = useNavigate();
  const chartRef = useRef();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'doughnut'
  const [filter, setFilter] = useState('all'); // all | low | high

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const generateColors = (count) => {
    return Array.from({ length: count }, (_, i) =>
      `hsl(${(360 / count) * i}, 70%, 60%)`
    );
  };

  const getFilteredProducts = () => {
    if (filter === 'low') return products.filter(p => p.stock <= 5);
    if (filter === 'high') return products.filter(p => p.stock > 5);
    return products;
  };

  const filteredProducts = getFilteredProducts();
  const productNames = filteredProducts.map(p => p.name);
  const productQuantities = filteredProducts.map(p => p.stock);
  const productColors = generateColors(filteredProducts.length);

  const chartData = {
    labels: productNames,
    datasets: [{
      label: 'Cantidad en inventario',
      data: productQuantities,
      backgroundColor: productColors,
      borderColor: productColors,
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: chartType === 'bar' ? 'top' : 'right',
      },
      title: {
        display: true,
        text: 'Inventario de productos',
        font: { size: 20 }
      }
    },
    scales: chartType === 'bar' ? {
      y: { beginAtZero: true, title: { display: true, text: 'Cantidad' } },
      x: { title: { display: true, text: 'Productos' } }
    } : {}
  };

  const handleDownload = async (type = 'png') => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    if (type === 'png') {
      const link = document.createElement('a');
      link.download = `inventario_grafico_${Date.now()}.png`;
      link.href = imgData;
      link.click();
    } else {
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`inventario_grafico_${Date.now()}.pdf`);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const lowStockProducts = filteredProducts.filter(p => p.stock <= 5);

  return (
    <Box p={3} bgcolor="#f8f9fb" borderRadius={4} boxShadow={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Inventario de Productos</Typography>
        <IconButton onClick={() => navigate('/dashboard')}>
          <Close />
        </IconButton>
      </Box>

      {/* Controles */}
      <Box display="flex" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <FormControl>
          <InputLabel>Tipo de gráfico</InputLabel>
          <Select value={chartType} onChange={(e) => setChartType(e.target.value)} label="Tipo de gráfico">
            <MenuItem value="bar">Barras</MenuItem>
            <MenuItem value="doughnut">Circular</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Filtrar por stock</InputLabel>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} label="Filtrar por stock">
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="low">Stock Bajo (≤ 5)</MenuItem>
            <MenuItem value="high">Stock Alto (≥ 5)</MenuItem>
          </Select>
        </FormControl>

        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => handleDownload('png')}
            sx={{ backgroundColor: '#4e9af1' }}
          >
            Descargar PNG
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => handleDownload('pdf')}
          >
            Descargar PDF
          </Button>
        </Box>
      </Box>

      {/* Alerta de stock bajo */}
      {lowStockProducts.length > 0 && (
        <Box mb={3}>
          <Alert severity="warning" sx={{ fontWeight: '500' }}>
            ⚠️ Tienes productos con stock bajo:{' '}
            <strong>
              {lowStockProducts.map(p => p.name).join(', ')}
            </strong>
          </Alert>
        </Box>
      )}

      {/* Gráfico */}
      {chartType === 'bar' ? (
        <Box ref={chartRef}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
      ) : (
        <Box ref={chartRef} sx={{ height: 400, maxWidth: 500, mx: 'auto' }}>
          <Doughnut
            data={chartData}
            options={{
              ...chartOptions,
              maintainAspectRatio: false,
              cutout: '50%',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default InventoryChart;
