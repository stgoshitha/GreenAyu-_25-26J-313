const express = require('express');
const {
  purchasePackage,
  deductCredits,
  getHistory,
  getAllPurchasesAdmin,
  confirmPurchaseAdmin,
  rejectPurchaseAdmin,
} = require('../controllers/transactionController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All transaction routes are protected

router.post('/purchase/:packageId', purchasePackage);
router.post('/analyze', deductCredits);
router.get('/history', getHistory);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllPurchasesAdmin);
router.put('/admin/confirm/:id', authorize('admin'), confirmPurchaseAdmin);
router.put('/admin/reject/:id', authorize('admin'), rejectPurchaseAdmin);

module.exports = router;
