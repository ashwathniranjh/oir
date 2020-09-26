const path = require('path');

const express = require('express');

const mainController = require('../controllers/main');

const isAuth =  require('../middleware/is-auth');

const { check } =  require('express-validator/check');

const router = express.Router();

router.get('/', mainController.getLogin);

router.post('/', mainController.postLogin);

router.get('/signup', mainController.getSignup);

router.post('/signup', 
[
    check('rollno', 'Please enter a valid Rollno.').isNumeric().isLength({min:6,max:6}),
    check('password','please enter a password with only text and numbers atleast 8 characters long.').isAlphanumeric().isLength({min:8})
],mainController.postSignup);

router.get('/user/dashboard/:userId', isAuth, mainController.getDashboard);

router.post('/logout', mainController.postLogout);


module.exports = router;