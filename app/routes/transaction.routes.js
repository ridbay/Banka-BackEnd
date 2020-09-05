const transaction = require("../controllers/transaction.controller");
const authorize = require("../middlewares/auth");

module.exports = (app) => {
  //Create a new account
  // app.post('/transaction', authorize , transaction.create);

  //Credit Account
  app.post("/transactions/:accountNumber/credit", transaction.createCredit);
  //Debit Account
  app.post("/transactions/:accountNumber/debit", transaction.createDebit);
};
