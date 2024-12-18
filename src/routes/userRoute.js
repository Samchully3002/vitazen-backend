// /routes/userRoute.js

const express = require('express');
const userController = require('../controllers/userControllers.js');
const authenticateJWT = require('../middleware/auth.js');

const router = express.Router();

router.post('/users',authenticateJWT, userController.createUser);
router.get('/users', userController.getUser);
router.get('/users/account/number/:accountNumber',authenticateJWT, userController.getUserByAccountNumber);
router.get('/users/account/id/:identityNumber',authenticateJWT, userController.getUserByIdentityNumber);
router.put('/users/account/:id',authenticateJWT, userController.updateById);
router.delete('/users/account/:id',authenticateJWT, userController.deleteUserById);


module.exports = router;
