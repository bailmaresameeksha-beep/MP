const Analytics = require('../models/Analytics');
const Attempt = require('../models/Attempt');

exports.getDashboard = async (req, res) => {
  try {
    const analytics = await Analytics.find({ user: req.user._id })
      .populate('topic')
      .sort({ lastAttempted: -1 });

    const totalAttempts = await Attempt.countDocuments({ user: req.user._id });
    const avgAccuracy = await Attempt.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: { $multiply: ['$score', 100 / '$totalQuestions'] } }
        }
      }
    ]);

    res.json({
      analytics,
      stats: {
        totalAttempts: totalAttempts,
        avgAccuracy: avgAccuracy[0]?.avgScore?.toFixed(2) || 0,
        weakTopics: analytics.filter(a => a.masteryLevel === 'weak').length,
        strongTopics: analytics.filter(a => a.masteryLevel === 'strong').length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
