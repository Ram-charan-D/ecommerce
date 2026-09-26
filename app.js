const path = require("path");
const dns = require("dns");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
const errorController = require("./controllers/errorController");
const User = require("./models/user");

const app = express();
dns.setServers(["8.8.8.8", "1.1.1.1"]); // Google and Cloudflare DNS
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6ab698e003ebec549c7eab68")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://ramachrand_db_user:m0iVv3iDVnuZRoCm@cluster0.ukvcdkp.mongodb.net/shop?appName=Cluster0",
  )
  .then((res) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Ramcharan",
          email: "rcr@yopmail.com",
          cart: { items: [] },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => console.log(err));
