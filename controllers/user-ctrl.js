const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require("dotenv").config();


createUser = async (req, res) => {
  try {

    const { name, email, password } = req.body;
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;
    res.status(201).json(user);

  } catch (err) {
    return res.status(400).json({
      err,
      message: 'User not created!',
    })
  }
  // Our register logic ends here
}

loginUser = async (req, res) => {
   try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
}


updateUser = async (req, res) => {
  try {
    const body = req.body;
    const user = await User.findOne({ userId: req.params.id });

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    // Only update the fields that come from the request body
    Object.keys(body).forEach((key) => {
        user[key] = body[key];
      
    });

    console.log(user);
    await user.save();

    return res.status(200).json({
      success: true,
      id: user._id,
      message: "User updated!",
    });
  } catch (err) {
    return res.status(404).json({
      error: err,
      message: "User not updated!",
    });
  }
};


getUser = async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.user.user_id });
      return res.status(200).json({ success: true, data: user });
    } catch (err) {
      return res.status(400).json({ success: false, error: err });
    }
  };


/* ----------------------- UNUSED FUNCTIONS ----------------------- */

deleteMovie = async (req, res) => {
    await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }

        return res.status(200).json({ success: true, data: movie })
    }).catch(err => console.log(err))
}
getMovies = async (req, res) => {
    await Movie.find({}, (err, movies) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!movies.length) {
            return res
                .status(404)
                .json({ success: false, error: `Movie not found` })
        }
        return res.status(200).json({ success: true, data: movies })
    }).catch(err => console.log(err))
}

testUser = async (req, res) => {
  console.log(req.user.user_id)
  res.status(200).send("Welcome 🙌 ");
}


module.exports = {
    createUser,
    loginUser,
    updateUser,
    getUser,
    testUser
}