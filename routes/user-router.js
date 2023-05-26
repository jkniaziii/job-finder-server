const express = require('express');
const UserCtrl = require('../controllers/user-ctrl');
const auth = require("../middleware/auth");

const router = express.Router();

router.post('/register', UserCtrl.createUser);
router.post('/login', UserCtrl.loginUser);
router.put('/user/:id', UserCtrl.updateUser);
// router.get('/user/:id', UserCtrl.getUserById);
router.get('/user', auth, UserCtrl.getUser);


module.exports = router;