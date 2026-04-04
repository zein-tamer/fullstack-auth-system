const express = require('express');
const router = express.Router();
const path = require('path');
const resetPasswordController = require('../controllers/resetPasswordControllers');

// عرض صفحة HTML
router.get('/reset-password/:token', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/reset.html'));
});

// استقبال كلمة المرور الجديدة
router.post('/reset-password/:token', resetPasswordController.resetPassword);

module.exports = router;
