const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/checkAdmin');

router.get('/', verifyToken, employeesController.getEmployees);
router.post('/', verifyToken, checkAdmin, employeesController.addEmployee);
router.put('/:id', verifyToken, employeesController.editEmployee);
router.delete('/:id', verifyToken, employeesController.deleteEmployee);

module.exports = router;
