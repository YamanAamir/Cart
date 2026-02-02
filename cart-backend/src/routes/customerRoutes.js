const express = require('express');
const router = express.Router();

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomersPagination,
  patchCustomer,
  loginCustomer,
  bulkDeleteCustomers,
} = require('../controllers/customerController');

router.post('/customer', createCustomer);
router.post('/customers/login', loginCustomer);
router.get('/customer', getCustomers);
router.get('/customer-pagination', getCustomersPagination);
router.get('/customer/:id', getCustomerById);
router.put('/customer/:id', updateCustomer);
router.patch('/customer/:id', patchCustomer);
router.post('/bulk-delete-customers', bulkDeleteCustomers);

module.exports = router;
