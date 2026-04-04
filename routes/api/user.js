const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser
} = require('../../controllers/userController');

// ==================== ROUTE / ====================
router.route('/')
    .get(getAllUsers)
    .post(createNewUser);

// ==================== ROUTE /:id ====================
router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
