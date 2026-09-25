const path = require("path");
const dns = require("dns");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
// const User = require("./models/user");

const app = express();
dns.setServers(["8.8.8.8", "1.1.1.1"]); // Google and Cloudflare DNS
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // User.findById("6ab54c08b9885d6676a597d6")
  //   .then((user) => {
  //     req.user = new User(user._id, user.name, user.email, user.cart);
  //     next();
  //   })
  //   .catch((err) => console.log(err));
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://ramachrand_db_user:m0iVv3iDVnuZRoCm@cluster0.ukvcdkp.mongodb.net/shop?appName=Cluster0",
  )
  .then((res) => app.listen(3000))
  .catch((err) => console.log(err));
