const user = require("../controllers/user.controller");
//   const authorize = require("../middlewares/auth");

module.exports = (app) => {
  //Create a new user
  app.post("api/v1/auth/signup", user.signup);

  //Signin an existing user
  app.post("api/v1/auth/signin", user.signin);

  //Get all users
  app.get("api/v1/auth/users", user.findAllUsers);

  //Get one User
  app.get("api/v1/auth/user", user.getOneUser);
  
  // Delete a User
  app.delete("api/v1/auth/deleteAll", user.deleteAll);

  //   //Create a bank account
  //   app.post("/accounts", authorize, user.accounts);

  //   //Activate or Deactivate an account

  //   app.put("/account/:accountNumber", authorize, user.updateAccount);

  //   //Delete an Account

  //   app.delete("/accounts/:accountNumber", authorize, user.deleteAccount);
};
