const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const { promisify } = require("util");

const user = require("../models/user");

const randomBytesAsync = promisify(crypto.randomBytes);

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
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

exports.getReset = (req, res, next) => {
  const errorMessage = req.flash("error");
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
  });
};

exports.postReset = async (req, res, next) => {
  try {
    const buffer = await randomBytesAsync(32);
    const token = buffer.toString("hex");

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error", "No account with email found");
      return res.redirect("/reset");
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();

    res.redirect("/");

    transporter
      .sendMail({
        to: req.body.email,
        from: "ramcharanreddy1111@gmail.com",
        subject: "Reset Password",
        html: `
          <h1>Reset your password using the link below</h1>
          <a href="http://localhost:3000/new-password/${token}">Click here to reset password</a>
        `,
      })
      .catch((mailErr) => {
        console.error("Background email delivery failed:", mailErr);
      });
  } catch (err) {
    console.error("Error in postReset:", err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
    req.flash("error", "No account with token found");
    return res.redirect("/reset");
  }
  const errorMessage = req.flash("error");
  res.render("auth/new-password", {
    path: "/new-password",
    pageTitle: "New Password",
    errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
    userId: user._id.toString(),
    token: token,
  });
};

exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.token;

  const user = await User.findOne({
    _id: userId,
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  console.log("user params", { userId, token, date: Date.now() });
  console.log("user", user);
  if (!user) {
    req.flash("error", "No account with token found");
    return res.redirect("/reset");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();
  res.redirect("/login");
};
