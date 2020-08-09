const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// {
//     “id” : Integer,
//     “createdOn” : DateTime,
//     “type” : String, // credit or debit
//     “accountNumber” : Integer,
//     “cashier” : Integer, // cashier who consummated the transaction
//     “amount” : Float,
//     “oldBalance” : Float,
//     “newBalance” : Float,
//     ...
//     }



const transactionSchema = new Schema({
    type: String,
    accountNumber: String,
    cashier: Number,
    amount: Number,
    oldBalance: Number,
    newBalance: Number,
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
  })


module.exports = mongoose.model("Transaction", transactionSchema, 'transactions');