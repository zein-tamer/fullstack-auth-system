
const express = require('express');
const router = express.Router();

const {  logoutAll } = require('../controllers/logoutController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/', verifyJWT, logoutAll);

module.exports = router;
