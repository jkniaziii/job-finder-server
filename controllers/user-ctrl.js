const User = require('../models/user-model');
const UserToken = require('../models/user-token');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require("../middleware/auth");
require("dotenv").config();


createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), password: encryptedPassword });
    const { accessToken, refreshToken } = await auth.generateTokens({ _id: user._id, email });
    const response = { id: user._id, accessToken, refreshToken }
    res.status(201).json(response);
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ err, message: 'User not created!' })
  }
}

loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && bcrypt.compare(password, user.password)) {
      const { accessToken, refreshToken } = await auth.generateTokens({ _id: user._id, email });
      const response = { id: user._id, accessToken, refreshToken };
      return res.status(200).json(response);
    }

    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
}


updateUser = async (req, res) => {
  try {
    const body = req.body;
    const user = await User.findOne({ userId: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    // Only update the fields that come from the request body
    Object.keys(body).forEach((key) => user[key] = body[key]);
    await user.save();
    return res.status(200).json({ success: true, id: user._id, message: "User updated!" });
  } catch (err) {
    return res.status(404).json({ error: err, message: "User not updated!" });
  }
};


getUser = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.user_id });
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

refreshToken = async (req, res) => {
  try {
    const tokenDetails = await auth.verifyRefreshToken(req.body.refreshToken);
    const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
    const accessToken = jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: "14m" });
    res.status(200).json({ error: false, accessToken, message: "Access token created successfully" });
  } catch (error) {
    console.log({error});
    return res.status(400).json({ success: false, error: error });
  }
};


logoutUser = async (req, res) => {
  try {
    const userToken = await UserToken.findOne({ token: req.body.refreshToken });
    console.log({userToken});
    if (!userToken) {
      return res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
    }
    await userToken.deleteOne();
    res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};


module.exports = {
  createUser,
  loginUser,
  updateUser,
  getUser,
  refreshToken,
  logoutUser
}