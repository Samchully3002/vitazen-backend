// /routes/userRoute.js

const express = require('express');
const userController = require('../controllers/userControllers.js');
const authenticateJWT = require('../middleware/auth.js');

const router = express.Router();

router.post('/users', userController.createUser);
router.get('/users', userController.getUser);
router.get('/users/:id', userController.getUserByIdentityNumber);
router.put('/users/:id', userController.updateById);
router.delete('/users/:id', userController.deleteUserById);


module.exports = router;
