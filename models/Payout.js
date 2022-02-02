const mongoose = require("mongoose");

const { Schema } = mongoose;

const Payouts = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    userID: {
      type: String,
      required: true,
    },
    purchaseType: {
      type: String,
      enum: ["SubCategory", "Test Series"],
      required: true,
    },
    email: {
      type: String,
      default: "",
    },
    contact: {
      type: String,
      default: "",
    },
    orderID: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
    },
    subCategoryID: {
      type: String,
      default: "",
    },
    testID: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Success", "Pending", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Payout = mongoose.model("Payout", Payouts);

exports.Payout = Payout;
