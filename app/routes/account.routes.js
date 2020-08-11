const accounts = require('../controllers/account.controller.js');
  const authorize = require("../middlewares/auth"); 

module.exports = (app)=>{
    //Create a new account
    app.post('/accounts', authorize , accounts.create);

    //Retrieve all accounts
    app.get('/accounts',authorize, accounts.findAll);

    //Retrieve a single account with accountNumber
    app.get('/accounts/:accountNumber', accounts.findOne);

    //Update a account with accountNumber
    app.put('/account/:accountNumber', accounts.update);

    //Delete a account with accountNumber

    app.delete('accounts/accountNumber', accounts.delete)
}