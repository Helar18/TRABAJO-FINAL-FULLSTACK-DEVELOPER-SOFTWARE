    const db = require('../config/db');

    const Company = {
    getCompany: (callback) => {
        db.query('SELECT * FROM empresa LIMIT 1', callback);
    },
    updateCompany: (data, callback) => {
        const { nombre, ruc, direccion, telefono, email, representante } = data;
        db.query(
        'UPDATE empresa SET nombre = ?, ruc = ?, direccion = ?, telefono = ?, email = ?, representante = ? WHERE id = 1',
        [nombre, ruc, direccion, telefono, email, representante],
        callback
        );
    }
    };

    module.exports = Company;
