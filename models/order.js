const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: {
        required: true,
        type: Object,
        ref: "Product",
      },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    email: { type: String, required: true },
    userId: {
      required: true,
      ref: "User",
      type: Schema.Types.ObjectId,
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
