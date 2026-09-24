const path = require("path");
const dns = require("dns");
const express = require("express");
const bodyParser = require("body-parser");
const { mongoConnect } = require("./util/database");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();
dns.setServers(["8.8.8.8", "1.1.1.1"]); // Google and Cloudflare DNS
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6ab54c08b9885d6676a597d6")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  if (User) app.listen(3000);
});
