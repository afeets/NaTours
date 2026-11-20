const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot', authController.forgotPassword);
router.patch('/reset/:token', authController.resetPassword);

// use middleware to protect all routes listed below
router.use(authController.protect);

router.route('/updatePassword/').patch(authController.updatePassword);
router.route('/me').get(userController.getMe, userController.getUserById);
router.route('/updateMe').patch(userController.updateMe);
router.route('/deleteMe').delete(userController.deleteMe);

// use middleware to allow only admin to use the routes listed below
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
