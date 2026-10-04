exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // req.isLoggedIn = true;
  // res.setHeader("Set-Cookie", "IsLoggedIn=true");
  req.session.isLoggedIn = true;
  res.redirect("/");
};
