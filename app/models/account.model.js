const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    // owner: Number, // user
    type: String, // savings, current
    accountNumber: Number,
    status: String, // draft, active, or dormant
    // cashier: Number,
    // amount: Number,
    accountBalance: { type: Number, default: 0 },
    // openingBalance: { type: Number, default: 0 },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//To use this app with a front-end that needs id field instead of _id, override toJSON method that map default object to a custom object.

accountSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model("Account", accountSchema, "accounts");
