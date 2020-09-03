const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    type: String, // credit or debit
    accountNumber: Number,
    cashier: Number, // cashier who consummated the transaction
    amount: Number,
    oldBalance: Number,
    newBalance: Number,
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    account: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
      
    ],
  },
  {
    timestamps: true,
  }
);
//To use this app with a front-end that needs id field instead of _id, override toJSON method that map default object to a custom object.
transactionSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
module.exports = mongoose.model(
  "Transaction",
  transactionSchema,
  "transactions"
);
