import { Schema, models, model } from "mongoose";

const orderSchema = new Schema({
  name: String,
  color: String,
  size: String,
  quantity: Number,
  shippingAdress: String,
  city: String,
  phone: String,
  totalAmount: Number,
  status: {
    type: String,
    enum: ["en attente", "eonfirme", "pas de reponse", "annule","exporte"],
    default: "en attente",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = models.Order || model("Order", orderSchema);

export default Order;
