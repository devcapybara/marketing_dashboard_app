const createUserService = require('../../services/user/createUserService');

async function createClientUserController(req, res, next) {
  try {
    const { name, email, password, clientId } = req.body;

    if (!name || !email || !password || !clientId) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and clientId are required',
      });
    }

    const userData = {
      name,
      email,
      password,
      role: 'CLIENT',
      clientId,
    };

    const newUser = await createUserService(userData);

    return res.status(201).json({
      success: true,
      message: 'Client user created successfully',
      data: newUser,
    });
  } catch (error) {
    if (error.message === 'Email already exists') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

module.exports = createClientUserController;

