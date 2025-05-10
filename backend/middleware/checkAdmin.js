const { verifyToken } = require('./authMiddleware');

const checkAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    // Validar que req.user exista y tenga un rol
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción (solo administradores)' });
    }

    // Todo correcto, continuar
    next();
  });
};

module.exports = { checkAdmin };
