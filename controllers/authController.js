const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email || "rcr@yopmail.com";
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.session.isLoggedIn = true;
        req.session.userId = user._id.toString();
        req.session.save((err) => {
          console.log(err);
          res.redirect("/");
        });
      }
    })
    .catch((err) => console.log(err));
  // req.body.password
  // req.isLoggedIn = true;
  // res.setHeader("Set-Cookie", "IsLoggedIn=true");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
