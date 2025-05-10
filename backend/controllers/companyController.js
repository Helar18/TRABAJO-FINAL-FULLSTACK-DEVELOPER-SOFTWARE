    const db = require('../config/db');

    exports.getCompanyInfo = async (req, res) => {
    try {
        const [company] = await db.query('SELECT * FROM empresa LIMIT 1');
        if (company.length === 0) {
        return res.status(404).json({ message: 'No se encontró la empresa' });
        }
        res.status(200).json(company[0]);
    } catch (err) {
        console.error('Error al obtener la información de la empresa:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
    };

    exports.updateCompanyInfo = async (req, res) => {
    const { id } = req.params;
    const { nombre, ruc, direccion, telefono, email, representante } = req.body;

    try {
        const [result] = await db.query(
        'UPDATE empresa SET nombre = ?, ruc = ?, direccion = ?, telefono = ?, email = ?, representante = ? WHERE id = ?',
        [nombre, ruc, direccion, telefono, email, representante, id]
        );

        if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Empresa no encontrada' });
        }

        const [updatedCompany] = await db.query('SELECT * FROM empresa WHERE id = ?', [id]);
        res.status(200).json(updatedCompany[0]);
    } catch (err) {
        console.error('Error al actualizar la empresa:', err);
        res.status(500).json({ message: 'Error al actualizar empresa' });
    }
    };
