
const express = require('express');
const contactController = require('../controllers/contactusController.js');
const authenticateJWT = require('../middleware/auth.js');


const router = express.Router();
router.get('/contactus/messages', contactController.getAllMessage);


module.exports = router;