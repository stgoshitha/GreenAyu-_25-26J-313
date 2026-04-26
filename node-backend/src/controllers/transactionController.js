const Purchase = require('../models/Purchase');
const Package = require('../models/Package');
const User = require('../models/User');
const AnalysisLog = require('../models/AnalysisLog');

// @desc    Purchase a package (Request)
// @route   POST /api/transactions/purchase/:packageId
// @access  Private
exports.purchasePackage = async (req, res, next) => {
  try {
    const pckg = await Package.findById(req.params.packageId);

    if (!pckg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
      });
    }

    // Create a pending purchase request
    const purchase = await Purchase.create({
      user: req.user.id,
      package: pckg._id,
      amountPaid: pckg.price,
      tokensAdded: pckg.tokenAmount,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      message: 'Package request sent to Admin for approval',
      data: purchase,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get all purchases (Admin Only)
// @route   GET /api/transactions/admin/all
// @access  Private/Admin
exports.getAllPurchasesAdmin = async (req, res, next) => {
  try {
    const purchases = await Purchase.find()
      .populate('user', 'name email')
      .populate('package', 'name price')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: purchases,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Confirm a purchase (Admin Only)
// @route   PUT /api/transactions/admin/confirm/:id
// @access  Private/Admin
exports.confirmPurchaseAdmin = async (req, res, next) => {
  try {
    let purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase request not found',
      });
    }

    if (purchase.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been processed',
      });
    }

    // Update status
    purchase.status = 'completed';
    await purchase.save();

    // Add tokens to user
    const user = await User.findById(purchase.user);
    if (user) {
      user.tokens += purchase.tokensAdded;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Purchase confirmed and tokens added to user account',
      data: purchase,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Reject a purchase (Admin Only)
// @route   PUT /api/transactions/admin/reject/:id
// @access  Private/Admin
exports.rejectPurchaseAdmin = async (req, res, next) => {
  try {
    let purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase request not found',
      });
    }

    if (purchase.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been processed',
      });
    }

    purchase.status = 'failed';
    await purchase.save();

    res.status(200).json({
      success: true,
      message: 'Purchase request rejected',
      data: purchase,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Deduct credits for analysis
// @route   POST /api/transactions/analyze
// @access  Private
exports.deductCredits = async (req, res, next) => {
  const CREDIT_COST = 20;

  try {
    const user = await User.findById(req.user.id);

    if (user.tokens < CREDIT_COST) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits. 20 credits required for analysis.',
      });
    }

    user.tokens -= CREDIT_COST;
    user.analysisCount += 1;
    await user.save();

    // Create analysis log entry
    await AnalysisLog.create({
      user: user._id,
      creditsSpent: CREDIT_COST
    });

    res.status(200).json({
      success: true,
      message: 'Analysis credits deducted successfully',
      remainingTokens: user.tokens,
      analysisCount: user.analysisCount
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get user purchase history
// @route   GET /api/transactions/history
// @access  Private
exports.getHistory = async (req, res, next) => {
  try {
    const history = await Purchase.find({ user: req.user.id }).populate('package').sort('-createdAt');

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
