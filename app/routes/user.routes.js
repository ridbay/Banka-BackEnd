const user = require("../controllers/user.controller");
//   const authorize = require("../middlewares/auth");

module.exports = (app) => {
  //Create a new user
  app.post("/signup", user.signup);

  //Signin an existing user
  app.post("/signin", user.signin);

  //   //Create a bank account
  //   app.post("/accounts", authorize, user.accounts);

  //   //Activate or Deactivate an account

  //   app.put("/account/:accountNumber", authorize, user.updateAccount);

  //   //Delete an Account

  //   app.delete("/accounts/:accountNumber", authorize, user.deleteAccount);
};
