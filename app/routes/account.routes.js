const accounts = require("../controllers/account.controller.js");
const authorize = require("../middlewares/auth");

module.exports = (app) => {
  //Create a new account
  // app.post('/accounts', authorize , accounts.create);

  //Create a new account
  app.post("/api/v1/accounts", accounts.create);

  //Retrieve all accounts
  app.get("/api/v1/accounts", accounts.findAll);

  //Retrieve a single account with accountNumber
  app.get("/api/v1/accounts/:accountNumber", accounts.findOne);

  //Update a account with accountNumber
  app.put("/api/v1/accounts/:accountNumber", accounts.update);

  //Delete an account with accountNumber

  app.delete("/api/v1/accounts/:id", accounts.delete);
};
