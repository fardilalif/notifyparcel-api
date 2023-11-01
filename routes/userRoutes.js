const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/authentication.js');
const {
  getAllUsers,
  showMe,
  updateUser,
  updateUserPassword,
  getSingleUser,
} = require('../controllers/userController.js');

router.get('/', authenticateUser, authorizePermissions('admin'), getAllUsers);
router.get('/showMe', authenticateUser, showMe);
router.patch('/updateUser', authenticateUser, updateUser);
router.patch('/updateUserPassword', authenticateUser, updateUserPassword);
router.get('/:id', authenticateUser, getSingleUser);

module.exports = router;
