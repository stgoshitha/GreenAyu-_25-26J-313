const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role, // In production, you might want to restrict role setting
    });

    // Send Welcome Email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to GreenAyu Agriculture!',
        message: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #22c55e;">Welcome to GreenAyu Agriculture, ${user.name}!</h2>
            <p>Thank you for joining our community of sustainable farming and botanical excellence.</p>
            <p>Your account has been successfully created. You can now access our AI-powered plant identification, health checking, and quality grading tools.</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; font-weight: bold;">Your Account Details:</p>
              <p style="margin: 5px 0;">Email: ${user.email}</p>
              <p style="margin: 5px 0;">Role: ${user.role || 'User'}</p>
            </div>
            <p style="margin-top: 30px;">Happy farming!</p>
            <p style="color: #64748b; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
              The GreenAyu Team
            </p>
          </div>
        `,
      });
    } catch (err) {
      console.error('Welcome email could not be sent:', err);
      // We don't want to fail registration if email fails
    }

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an email and password',
    });
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
};

// @desc    Update user location
// @route   PUT /api/auth/location
// @access  Private
exports.updateLocation = async (req, res, next) => {
  try {
    const { lat, lon, city, isAuto } = req.body;

    const user = await User.findById(req.user.id);

    if (lat) user.location.lat = lat;
    if (lon) user.location.lon = lon;
    if (city) user.location.city = city;
    if (isAuto !== undefined) user.location.isAuto = isAuto;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Location preference updated',
      data: user.location
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      tokens: user.tokens,
      location: user.location,
    },
  });
};
