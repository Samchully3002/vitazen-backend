//controllers/userController.js

const User = require('../models/user');
const { getCache, setCache } = require('../utils/redisCache');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all user
exports.getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by account number with Redis caching
exports.getUserByAccountNumber = async (req, res) => {
  const { accountNumber } = req.params;
  const cacheKey = `acc:${accountNumber}`;
  try {
    // Check Redis cache
    const cachedAccNumber = await getCache(cacheKey);
    if (cachedAccNumber) {
      return res.status(200).json(cachedAccNumber);
    }

    // If not in cache, fetch from MongoDB
    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Store fetched data in Redis
    await setCache(cacheKey, user, 3600); // Cache for 1 hour

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Get user by identity number with Redis caching
exports.getUserByIdentityNumber = async (req, res) => {
  const { identityNumber } = req.params;
  const cacheKey = `id:${identityNumber}`;
  try {
    // Check Redis cache
    const cachedIdNumber = await getCache(cacheKey);
    if (cachedIdNumber) {
      return res.status(200).json(cachedIdNumber);
    }

    // If not in cache, fetch from MongoDB
    const user = await User.findOne({ identityNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Store fetched data in Redis
    await setCache(cacheKey, user, 3600); // Cache for 1 hour

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
  
};

// Update User By Identity Number
exports.updateById = async (req, res) => {
  const { id } = req.params;
  const { userName, accountNumber, emailAddress, identityNumber } = req.body;
  try {
        // Find the current document
        const existingItem = await User.findById(id);

        if (!existingItem) {
          return res.status(404).json({ message: 'User not found' });
        }
        // Check if each field has changed to avoid redundant updates
        const updateFields = {};
        if (userName && userName !== existingItem.userName) updateFields.userName = userName;
        if (accountNumber && accountNumber !== existingItem.accountNumber) updateFields.accountNumber = accountNumber;
        if (emailAddress && emailAddress !== existingItem.emailAddress) updateFields.emailAddress = emailAddress;
        if (identityNumber && identityNumber !== existingItem.identityNumber) updateFields.identityNumber = identityNumber;

         // If no fields have changed, return early
        if (Object.keys(updateFields).length === 0) {
          return res.status(200).json({ message: 'No changes detected' });
        }

        const user = await User.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'Failed update user' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete User By Identity Number
exports.deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted' });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};
