const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users_controller');


// const postController = require('../controllers/post_controller');
// router.get('/image',postController.image);

router.get('/profile',usersController.profile);

router.get('/sign-up',usersController.signUp);
router.get('/sign-in',usersController.signIn);
router.post('/create',usersController.create);
router.post('/create-session',usersController.createSession);
router.get('/sign-out',usersController.deleteSession);

module.exports = router;