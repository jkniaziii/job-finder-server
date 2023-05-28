const jwt = require('jsonwebtoken');
const UserToken = require('../models/user-token');
require("dotenv").config();


const generateTokens = async (user) => {
    try {
        const payload = { _id: user._id, email: user.email };
       

        const accessToken = jwt.sign(
            payload,
            process.env.TOKEN_KEY,
            {
              expiresIn: "14m",
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
    generateTokens
  }