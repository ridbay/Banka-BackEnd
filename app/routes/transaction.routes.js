const transaction = require("../controllers/transaction.controller");
const authorize = require("../middlewares/auth");

module.exports = (app) => {
  //Create a new account
  // app.post('/transaction', authorize , transaction.create);

  //Credit Account
  app.post("/transactions/:accountNumber/credit", transaction.createCredit);
  //Debit Account
  app.post("/transactions/:accountNumber/debit", transaction.createDebit);
  //Get all transactions
  app.get("/transactions", transaction.findAll);
  //Get One transactions
  app.get("/transactions/:id", transaction.findOne);

  //Delete an transaction with an ID
  app.delete("/transactions/:id", transaction.delete);
};
