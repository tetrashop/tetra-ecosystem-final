const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const walletCtrl = require('../controllers/walletController');
const adminCtrl = require('../controllers/adminController');
const auth = require('../middleware/auth');

// auth
router.post('/api/auth/register', authCtrl.register);
router.post('/api/auth/login', authCtrl.login);
router.post('/api/auth/logout', auth, authCtrl.logout);

// wallet
router.get('/api/wallet', auth, walletCtrl.getWallet);
router.post('/api/transfer', auth, walletCtrl.transfer);

// admin
router.get('/api/admin/stats', auth, adminCtrl.getStats);
router.get('/api/admin/users', auth, adminCtrl.getUsers);

module.exports = router;
