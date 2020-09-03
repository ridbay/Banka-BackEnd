const accounts = require("../controllers/account.controller.js");
const authorize = require("../middlewares/auth");

module.exports = (app) => {
  //Create a new account
  // app.post('/accounts', authorize , accounts.create);

  //Credit Account
  app.post("/transactions/:accountNumber/credit", accounts.createCredit);
  //Debit Account
  app.post("/transactions/:accountNumber/debit", accounts.createDebit);
};
