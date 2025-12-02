const findUserByEmailService = require('../../services/user/findUserByEmailService');
const verifyPasswordService = require('../../services/auth/verifyPasswordService');
const generateJwtService = require('../../services/auth/generateJwtService');
const User = require('../../models/User');

async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const user = await findUserByEmailService(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact administrator.',
      });
    }

    // Verify password
    const isPasswordValid = await verifyPasswordService(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate JWT token
    let token;
    try {
      token = generateJwtService(user._id);
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate authentication token',
      });
    }

    // Prepare user data (exclude passwordHash)
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      clientId: user.clientId ? user.clientId.toString() : null,
      managedClientIds: user.managedClientIds ? user.managedClientIds.map(id => id.toString()) : [],
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    console.error('Login error details:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    next(error);
  }
}

module.exports = loginController;

