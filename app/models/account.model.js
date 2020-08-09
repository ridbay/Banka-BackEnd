const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const accountSchema = new Schema({
    owner : Number, // user
    type: String, // savings, current
    accountNumber: Number,
    status : String, // draft, active, or dormant
    cashier: Number,
    amount: Number,
    oldBalance: { type: Number, default: 0},
    newBalance: { type: Number, default: 0},
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
      }]
  })


module.exports = mongoose.model("Account", accountSchema, 'accounts');