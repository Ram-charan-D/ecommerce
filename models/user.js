const { Schema, default: mongoose } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
// const getDb = require("../util/database").getDb;
// const { ObjectId } = require("mongodb");

// class User {
//   constructor(id, username, email, cart) {
//     this._id = id;
//     this.email = email;
//     this.name = username;
//     this.cart = cart || { items: [] };
//   }

//   save() {
//     const db = getDb();
//     return db
//       .collections("users")
//       .insertOne(this)
//       .then((res) => res)
//       .catch((err) => console.log(err));
//   }

//   addToCart(product) {
//     const prdIdx = this.cart.items.findIndex(
//       (cp) => cp.productId.toString() === product._id.toString(),
//     );

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (prdIdx >= 0) {
//       newQuantity = this.cart.items[prdIdx].quantity + 1;
//       updatedCartItems[prdIdx].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { "cart.items": updatedCartItems } },
//       );
//   }

//   getCart() {
//     const db = getDb();

//     const prdIds = this.cart.items.map((i) => i.productId);

//     return db
//       .collection("products")
//       .find({ _id: { $in: prdIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => ({
//           ...p,
//           quantity: this.cart.items.find(
//             (i) => i.productId.toString() === p._id.toString(),
//           ).quantity,
//         }));
//       });
//   }

//   deleteProduct(productId) {
//     const updatedCartItems = this.cart.items.filter(
//       (i) => i.productId.toString() !== productId.toString(),
//     );

//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { "cart.items": updatedCartItems } },
//       );
//   }

//   addOrder() {
//     const db = getDb();

//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((res) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } },
//           );
//       });
//   }

//   getOrder() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(userId) })
//       .then((user) => user)
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;
