const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports.register = async (req, res, next) => {
  const user = new User();

  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password);

  try {
    await user.save();
    const token = user.generateJwt();
    res.json({
      userInfo: user,
      token: token
    });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

module.exports.login = function(req, res) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      res.status(404).json(err);
      return;
    }

    if (user) {
      const token = user.generateJwt();
      res.status(200);
      res.json({
        userInfo: user,
        token: token
      });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};
