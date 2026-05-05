const express = require('express');
const {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
} = require('../controllers/packageController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getPackages)
  .post(protect, authorize('admin'), createPackage);

router
  .route('/:id')
  .get(getPackage)
  .put(protect, authorize('admin'), updatePackage)
  .delete(protect, authorize('admin'), deletePackage);

module.exports = router;
