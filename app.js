const path = require("path");
const dns = require("dns");
const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

dns.setServers(["8.8.8.8", "1.1.1.1"]); // Google and Cloudflare DNS

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const { mongoConnect } = require("./util/database");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // User.findById(1)
  //   .then(user => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch(err => console.log(err));
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
