const express = require('express');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { login, signup, logout} = require('../controller/authController');
const {addPeriodDate, getTrackerData} = require('../controller/userController');
const User =  require('../models/User.js');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/calendar', isAuthenticated, addPeriodDate);
router.get('/tracker', isAuthenticated, getTrackerData);
router.get('/logout',logout);

module.exports = router;
