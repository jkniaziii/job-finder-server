const jwt = require("jsonwebtoken");
const UserToken = require("../models/user-token")
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const verifyRefreshToken = async (refreshToken) => {
  const privateKey = process.env.TOKEN_KEY;

  try {
      const doc = await UserToken.findOne({ token: refreshToken });
      if (!doc)
          throw { error: true, message: "Invalid refresh token" };
      const tokenDetails = jwt.verify(refreshToken, privateKey);
      return {
          tokenDetails,
          error: false,
          message: "Valid refresh token",
      };
  } catch (err) {
      throw { error: true, message: "Invalid refresh token" };
  }
};

const generateTokens = async (user) => {
  try {
      const payload = { _id: user._id, email: user.email };
     

      const accessToken = jwt.sign(
          payload,
          process.env.TOKEN_KEY,
          {
            expiresIn: "2m",
          }
        );
     
      const refreshToken = jwt.sign(
          payload,
          process.env.TOKEN_KEY,
          { expiresIn: "30d" }
      );

      const userToken = await UserToken.findOne({ userId: user._id });
      if (userToken) await userToken.remove();

      await new UserToken({ userId: user._id, token: refreshToken }).save();
      return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
      return Promise.reject(err);
  }
};


module.exports = {
  verifyToken,
  verifyRefreshToken,
  generateTokens
};