const transaction = require("../controllers/transaction.controller");
const authorize = require("../middlewares/auth");

module.exports = (app) => {
  //Create a new account
  // app.post('/transaction', authorize , transaction.create);

  //Credit Account
  app.post("/api/v1/transactions/:accountNumber/credit", transaction.createCredit);
  //Debit Account
  app.post("/api/v1/transactions/:accountNumber/debit", transaction.createDebit);
  //Get all transactions
  app.get("/api/v1/transactions", transaction.findAll);
  //Get One transactions
  app.get("/api/v1/transactions/:id", transaction.findOne);

  //Delete an transaction with an ID
  app.delete("/api/v1/transactions/:id", transaction.delete);
};
