const express = require('express');
const {
  getModels,
  getModel,
  createModel,
  updateModel,
  deleteModel,
  bulkDeleteModels,
  allModel
} = require('../controllers/modelController');

const router = express.Router();

// Model routes
router.get('/models', getModels);
router.get('/all-models', allModel);
router.get('/models/:id', getModel);
router.post('/models', createModel);
router.put('/models/:id', updateModel);
router.delete('/models/:id', deleteModel);
router.post('/bulk-delete-models',bulkDeleteModels );

module.exports = router;
