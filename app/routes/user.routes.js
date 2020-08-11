const user = require("../controllers/user.controller");
//   const authorize = require("../middlewares/auth");

module.exports = (app) => {
  //Create a new user
  app.post("/auth/signup", user.signup);

  //Signin an existing user
  app.post("/auth/signin", user.signin);

  //Get all users
  app.get("/auth/users", user.findAllUsers);

  // Create a new Tutorial
  app.delete("/auth/deleteAll", user.deleteAll);

  //   //Create a bank account
  //   app.post("/accounts", authorize, user.accounts);

  //   //Activate or Deactivate an account

  //   app.put("/account/:accountNumber", authorize, user.updateAccount);

  //   //Delete an Account

  //   app.delete("/accounts/:accountNumber", authorize, user.deleteAccount);
};
