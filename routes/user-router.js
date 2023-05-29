const express = require('express');
const UserCtrl = require('../controllers/user-ctrl');
const auth = require("../middleware/auth");

const router = express.Router();

router.post('/register', UserCtrl.createUser);
router.post('/login', UserCtrl.loginUser);
router.delete('/logout', UserCtrl.logoutUser);
router.put('/user/:id', UserCtrl.updateUser);
router.get('/user', auth.verifyToken, UserCtrl.getUser);
router.post('/refresh-token', UserCtrl.refreshToken);


module.exports = router;