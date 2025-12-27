const createUserService = require('../../services/user/createUserService');
const createClientService = require('../../services/client/createClientService');
const User = require('../../models/User');

async function registerController(req, res, next) {
  try {
    const { name, email, password, companyName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const newUser = await createUserService({ name, email, password, role: 'CLIENT' });

    const client = await createClientService({ name, companyName: companyName || name, contactEmail: email, createdBy: newUser._id });

    await User.findByIdAndUpdate(newUser._id, { clientId: client._id });

    return res.status(201).json({ success: true, message: 'Registration successful', data: { userId: newUser._id, clientId: client._id } });
  } catch (error) {
    if (error.message === 'Email already exists') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
}

module.exports = registerController;
