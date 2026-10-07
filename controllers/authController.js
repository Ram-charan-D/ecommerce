const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key:
        "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",
    },
  }),
);

exports.getLogin = (req, res, next) => {
  const errorMessage = req.flash("error");
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.userId = user._id.toString();
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
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

exports.getSignup = (req, res, next) => {
  const errorMessage = req.flash("error");
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
  });
};

exports.postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  try {
    // if (password !== confirmPassword) {
    //   req.flash("error", "Passwords do not match.");
    //   return res.redirect("/signup");
    // }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email exists already, pick a different one.");
      return res.redirect("/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await user.save();

    res.redirect("/login");

    transporter
      .sendMail({
        to: email,
        from: "ramcharanreddy1111@gmail.com",
        subject: "Signup Succeeded",
        html: "<h1>Welcome to our shop!</h1>",
      })
      .catch((mailErr) => {
        console.error("Background email delivery failed:", mailErr);
      });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

