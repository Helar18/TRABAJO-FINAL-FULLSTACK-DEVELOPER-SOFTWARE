    import React, { useEffect, useState, useRef } from 'react';
    import {
    Box, Typography, CircularProgress, IconButton, Button,
    MenuItem, Select, FormControl, InputLabel
    } from '@mui/material';
    import { Close, Download } from '@mui/icons-material';
    import { Bar, Doughnut } from 'react-chartjs-2';
    import { useNavigate } from 'react-router-dom';
    import html2canvas from 'html2canvas';
    import jsPDF from 'jspdf';
    import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
    } from 'chart.js';

    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

    const generateColor = (index) => {
    const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 205, 86, 0.7)',
        'rgba(201, 203, 207, 0.7)'
    ];
    return colors[index % colors.length];
    };

    const getFormattedTooltipInfo = (periodo) => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('es-ES', {
        weekday: periodo === 'dia' ? 'long' : undefined,
        day: periodo === 'semana' ? '2-digit' : undefined,
        month: periodo === 'mes' || periodo === 'semana' ? 'long' : undefined,
        year: periodo === 'mes' || periodo === 'semana' ? 'numeric' : undefined,
    });

    if (periodo === 'dia') {
        return `Hoy ${formatter.format(now)}`;
    }

    if (periodo === 'semana') {
        return `Fecha: ${formatter.format(now)}`;
    }

    if (periodo === 'mes') {
        const mes = now.toLocaleString('es-ES', { month: 'long' });
        const año = now.getFullYear();
        return `Mes: ${mes.charAt(0).toUpperCase() + mes.slice(1)} ${año}`;
    }

    return '';
    };

    const SalesChart = () => {
    const navigate = useNavigate();
    const chartRef = useRef();
    const [loading, setLoading] = useState(true);
    const [ventas, setVentas] = useState([]);
    const [periodo, setPeriodo] = useState('dia'); // 'dia', 'semana', 'mes'
    const [chartType, setChartType] = useState('bar'); // 'bar' or 'doughnut'

    const empleadoColors = new Map();

    const getYesterday = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    };

    useEffect(() => {
        const fetchData = async () => {
        setLoading(true);
        try {
            let endpoint = `http://localhost:5000/api/estadisticas/${periodo}`;
            if (periodo === 'dia') {
            const fecha = (new Date().getDate() === 1)
                ? getYesterday()
                : new Date().toISOString().split('T')[0];
            endpoint += `?fecha=${fecha}`;
            }

            const response = await fetch(endpoint);
            const data = await response.json();
            setVentas(data);
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [periodo]);

    const labels = ventas.map(v => v.empleado_name);

    const colors = ventas.map((v, index) => {
        if (!empleadoColors.has(v.empleado_name)) {
        empleadoColors.set(v.empleado_name, generateColor(index));
        }
        return empleadoColors.get(v.empleado_name);
    });

    const chartData = {
        labels,
        datasets: [{
        label: 'Monto vendido (S/)',
        data: ventas.map(v => parseFloat(v.total_monto)),
        backgroundColor: colors,
        borderColor: colors.map(c => c.replace('0.7', '1')),
        borderWidth: 1
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
            text: `Ventas por ${periodo}`,
            font: { size: 20 }
        },
        tooltip: {
            callbacks: {
            label: (context) => {
                const monto = context.raw;
                const infoExtra = getFormattedTooltipInfo(periodo);
                return [
                `${context.dataset.label}: S/. ${monto.toFixed(2)}`,
                infoExtra
                ];
            }
            }
        }
        },
        scales: chartType === 'bar' ? {
        y: { beginAtZero: true, title: { display: true, text: 'Total vendido (S/)' } },
        x: { title: { display: true, text: 'Empleado' } }
        } : {}
    };

    const handleDownload = async (type = 'png') => {
        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL('image/png');
        if (type === 'png') {
        const link = document.createElement('a');
        link.download = `ventas_grafico_${Date.now()}.png`;
        link.href = imgData;
        link.click();
        } else {
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
        pdf.save(`ventas_grafico_${Date.now()}.pdf`);
        }
    };

    if (loading) {
        return (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
        </Box>
        );
    }

    return (
        <Box p={3} bgcolor="#f8f9fb" borderRadius={4} boxShadow={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Estadísticas de Ventas</Typography>
            <IconButton onClick={() => navigate('/admin-dashboard')}>
            <Close />
            </IconButton>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
            <FormControl>
            <InputLabel>Periodo</InputLabel>
            <Select value={periodo} onChange={(e) => setPeriodo(e.target.value)} label="Periodo">
                <MenuItem value="dia">Por Día</MenuItem>
                <MenuItem value="semana">Por Semana</MenuItem>
                <MenuItem value="mes">Por Mes</MenuItem>
            </Select>
            </FormControl>

            <FormControl>
            <InputLabel>Tipo de gráfico</InputLabel>
            <Select value={chartType} onChange={(e) => setChartType(e.target.value)} label="Tipo de gráfico">
                <MenuItem value="bar">Barras</MenuItem>
                <MenuItem value="doughnut">Circular</MenuItem>
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

    export default SalesChart;
