const path = require('path');

const express = require('express');
const userAuthentication = require('../middleware/auth');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.post('/add-expense', userAuthentication.authenticate, expenseController.postAddExp);
router.get('/get-expense', userAuthentication.authenticate, expenseController.getExpense);
router.delete('/delete-expense/:id', userAuthentication.authenticate, expenseController.deleteExpense);
router.put('/edit-expense/:id', expenseController.editExpense);

router.get('/download', userAuthentication.authenticate, expenseController.downlaodExpense);
router.get('/downloadhistory', userAuthentication.authenticate, expenseController.downloadHistory);

module.exports = router;