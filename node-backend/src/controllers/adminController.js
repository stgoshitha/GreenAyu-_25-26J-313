const User = require('../models/User');
const Package = require('../models/Package');
const Purchase = require('../models/Purchase');
const AnalysisLog = require('../models/AnalysisLog');

// @desc    Get all dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    // 1. Basic Counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalPackages = await Package.countDocuments();
    
    // 2. Revenue (Sum of completed purchases)
    const revenueData = await Purchase.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // 3. AI Analyses (Sum of analysisCount across all users)
    const analysisData = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$analysisCount' } } }
    ]);
    const totalAnalyses = analysisData.length > 0 ? analysisData[0].total : 0;

    // 4. Chart Data (Analyses per day for the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const chartStats = await AnalysisLog.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format chart data to ensure all 7 days are represented even with 0s
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = chartStats.find(s => s._id === dateStr);
      last7Days.push({
        date: dateStr,
        count: match ? match.count : 0
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPackages,
        totalRevenue,
        totalAnalyses,
        chartData: last7Days
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
