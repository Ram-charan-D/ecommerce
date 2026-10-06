const path = require("path");
const dns = require("dns");
// Set custom DNS immediately before any network/database calls
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
// const csrf = require("csurf");
const csrf = require("@dr.pogodin/csurf");
const flash = require("connect-flash");

const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
const authRoutes = require("./routes/authRouter");
const routes = require("./routes");

const errorController = require("./controllers/errorController");
const User = require("./models/user");

const MONGODBURI =
  "mongodb+srv://ramachrand_db_user:m0iVv3iDVnuZRoCm@cluster0.ukvcdkp.mongodb.net/shop?appName=Cluster0";

const app = express();

const store = new MongoDBStore({
  uri: MONGODBURI,
  collection: "sessions",
});
const csrfProtection = (csrf.default || csrf)();

store.on("error", function (error) {
  console.log("Session store error:", error);
});

app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my secreat",
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.userId) {
    return next();
  }

  User.findById(req.session.userId)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// app.use("/admin", adminRoutes);
// app.use(shopRoutes);
// app.use(authRoutes);
// app.use(errorController.get404);

app.use(routes);

// 404 handler stays at the bottom
app.use(errorController.get404);

mongoose
  .connect(MONGODBURI)
  .then(() => {
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => console.log(err));
