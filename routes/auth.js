const path = require('path');
const express = require('express');
const userdata = require('../models/user');
const {body} = require('express-validator');
const router = express.Router();
// controller
const loginController = require('../controllers/login');
const signupController = require('../controllers/signup');
// middleware
const isauth = require('../middleware/isAuth');
const { isLength } = require('lodash');

// router
router.post('/login',loginController.loginReq);
// router.get('/auth',isauth);
router.post('/forgot',signupController.forgotreq);
router.post('/signup',body('email').isEmail().toLowerCase(),signupController.signupreq);
router.post('/otp',signupController.otpreq);
router.put('/password',body('pass').isLength({min:6}).matches("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[\$#%@&*/+_=?^!]).{6,}$"),signupController.passreq)
router.put('/resetpass',signupController.Resetpassreq);
router.post('/changepass',signupController.changePassword);


module.exports = router;