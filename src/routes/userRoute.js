// /routes/userRoute.js

const express = require('express');
const userController = require('../controllers/userControllers.js');
const authenticateJWT = require('../middleware/auth.js');

const router = express.Router();

router.post('/users',authenticateJWT, userController.createUser);
router.get('/users',authenticateJWT, userController.getUser);
router.get('/users/account/number/:accountNumber', userController.getUserByAccountNumber);
router.get('/users/account/id/:identityNumber', userController.getUserByIdentityNumber);
router.put('/users/account/:id', userController.updateById);
router.delete('/users/account/:id', userController.deleteUserById);


module.exports = router;
