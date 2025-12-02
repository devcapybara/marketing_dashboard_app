const createUserService = require('../../services/user/createUserService');

async function createAdminUserController(req, res, next) {
  try {
    const { name, email, password, managedClientIds } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const userData = {
      name,
      email,
      password,
      role: 'ADMIN',
      managedClientIds: managedClientIds || [],
    };

    const newUser = await createUserService(userData);

    return res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
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

module.exports = createAdminUserController;

