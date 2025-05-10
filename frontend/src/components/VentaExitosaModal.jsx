import React, { useState } from 'react';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const VentaExitosaModal = ({ open, onClose }) => {
  const [generandoPDF, setGenerandoPDF] = useState(false);

  const handleGenerarPDF = async () => {
    const original = document.getElementById('boleta-para-pdf');
    if (!original) return alert('No se encontró la boleta');

    setGenerandoPDF(true);

    let clone = null;

    try {
      clone = original.cloneNode(true);
      Object.assign(clone.style, {
        position: 'absolute',
        top: '-9999px',
        left: '0',
        width: '280px',
        zIndex: -9999,
      });
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 80; // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Boleta_${Date.now()}.pdf`);

      onClose();
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Ocurrió un error al generar el PDF.');
    } finally {
      if (clone) {
        document.body.removeChild(clone);
      }
      setGenerandoPDF(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
          width: 320,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 60, color: '#14B8A6', mb: 1 }} />
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ¡Venta exitosa!
        </Typography>
        <Typography sx={{ mb: 3, color: 'text.secondary' }}>
          Se ha registrado la venta correctamente.
        </Typography>

        <Button
          variant="contained"
          onClick={handleGenerarPDF}
          disabled={generandoPDF}
          sx={{
            backgroundColor: '#14B8A6',
            '&:hover': {
              backgroundColor: '#0D9488',
            },
            '&:disabled': {
              backgroundColor: '#94A3B8',
              color: '#E2E8F0',
            },
            minWidth: 150,
          }}
        >
          {generandoPDF ? <CircularProgress size={24} color="inherit" /> : 'Generar Ticket PDF'}
        </Button>
      </Box>
    </Modal>
  );
};

export default VentaExitosaModal;
