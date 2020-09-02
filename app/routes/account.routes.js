const accounts = require("../controllers/account.controller.js");
const authorize = require("../middlewares/auth");

module.exports = (app) => {
  //Create a new account
  // app.post('/accounts', authorize , accounts.create);

  //Create a new account
  app.post("/accounts", accounts.create);

  //Retrieve all accounts
  app.get("/accounts", accounts.findAll);

  //Retrieve a single account with accountNumber
  app.get("/accounts/:accountNumber", accounts.findOne);

  //Update a account with accountNumber
  app.put("/accounts/:accountNumber", accounts.update);

  //Delete an account with accountNumber

  app.delete("/accounts/:id", accounts.delete);
};
