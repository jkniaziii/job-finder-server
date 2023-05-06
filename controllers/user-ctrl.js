const User = require('../models/user-model')

createUser = (req, res) => {
    const body = req.body
    const user = new User(body)

    if (!user) {
        return res.status(400).json({ success: false, error: err })
    }

    user
        .save()
        .then(() => {
            return res.status(200).json({
                success: true,
                id: user._id,
                message: 'User created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'User not created!',
            })
        })
}

updateUser = async (req, res) => {
    try {
      const body = req.body;
      const user = await User.findOne({ _id: req.params.id });
  
      if (!user) {
        return res.status(404).json({
          message: "User not found!",
        });
      }
  
      user.name = body.name;
      user.email = body.email;
      user.userId = body.userId;
      user.isVarified = body.isVarified;
      user.isSubscriber = body.isSubscriber;
      user.professionalInfo = body.professionalInfo;
  
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

getUserById = async (req, res) => {
    try {
      console.log("HERE");
      const user = await User.findOne({ _id: req.params.id });
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

module.exports = {
    createUser,
    updateUser,
    getUserById,
}