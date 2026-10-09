// routes/index.js
const express = require("express");
const router = express.Router();

// Middlewares
const isAuth = require("../middleware/is-auth");

// Controllers
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const shopController = require("../controllers/shopController");

// ========================
// Auth Routes
// ========================
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/new-password/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

// ========================
// Shop Routes
// ========================
router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);
router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);
router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);
router.post("/create-order", isAuth, shopController.postOrder);
router.get("/orders", isAuth, shopController.getOrders);

// ========================
// Admin Routes (Prefixed)
// ========================
router.get("/admin/add-product", isAuth, adminController.getAddProduct);
router.post("/admin/add-product", isAuth, adminController.postAddProduct);
router.get("/admin/products", isAuth, adminController.getProducts);
router.get(
  "/admin/edit-product/:productId",
  isAuth,
  adminController.getEditProduct,
);
router.post("/admin/edit-product", isAuth, adminController.postEditProduct);
router.post("/admin/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
