const express = require('express');
const UserController = require('../controllers/userController');
const AuthController = require('../controllers/authController');
const ViewsController = require('../controllers/viewsController');

const router = express.Router();

router.route('/signup').post(AuthController.signup);
router.route('/login').get(ViewsController.getLoginForm).post(AuthController.login);
router.route('/logout').get(AuthController.logout);

router.route('/forgot-password').post(AuthController.forgotPassword);
router.route('/reset-password/:token').patch(AuthController.resetPassword);


// All routes after protect function are protected
router.use(AuthController.protect);

router.route('/update-password').patch(AuthController.updatePassword);
router.route('/update-me').patch(UserController.updateMe);
router.route('/delete-me').delete(UserController.deleteMe);
router.route('/my-profile').get(UserController.getMe, UserController.getUser);

// Use middleware function to check the ID for the routes that has ids. VERY USEFULL.
// router.param('id', tripController.checkId());

// router.route('/')
// .get(UserController.getAllUsers)
// .post(UserController.addNewUser);

router.route('/:id')
.get(UserController.getUser)
.patch(UserController.updateUser)
.delete(UserController.deleteUser);

module.exports = router;