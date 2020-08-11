const Account = require("../models/account.model");
const User = require("../models/user.model");
// Create and Save a new Account
exports.create = async (req, res) => {
  try {
    // Create a Account
    const account = new Account({
      accountNumber: Math.floor(
        Math.random() * (9999999999 - 1111111111) + 1111111111
      ),
      type: req.body.type,
      status: "active",
      cashier: 123,
      newBalance: Number(req.body.openingBalance),
    });

    // Save Account in the database
    const savedAccount = await account.save();
    console.log(savedAccount);
    // Adds account to User
    // Then saves User to database
    const user = await User.findOne({ email: req.body.email });
    user.accounts.push(savedAccount.id);
    const savedUser = await user.save();
    console.log(savedUser);
    res.json({ message: "Bank account created", data: savedUser });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while creating the account.",
    });
  }

  // // Save Account in the database
  // account
  //   .save()
  //   .then((data) => {
  //     res.json({
  //       message: "Bank account created",
  //       data: data,
  //     });
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       message:
  //         err.message || "Some error occurred while creating the account.",
  //     });
  //   });
};

// Retrieve and return all accounts from the database.
exports.findAll = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const accounts = await Account.find();
    // const accounts = await user.populate("accounts").exec();
    console.log(accounts);
    return res.json({
      data: accounts,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Some error occurred while retrieving accounts.",
    });
  }

 

  // Account.find()
  //   .then((accounts) => {
  //     res.json({
  //       message: "All accounts retrieved",
  //       data: accounts,
  //     });
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       message:
  //         err.message || "Some error occurred while retrieving accounts.",
  //     });
  //   });
};

// Find a single account with a accountNumber
exports.findOne = async (req, res) => {
  // function getUserWithPosts(username){
  //   return User.findOne({ username: username })
  //     .populate('posts').exec((err, posts) => {
  //       console.log("Populated User " + posts);
  //     })
  // }


  try {
    const user = await User.findOne({ email: req.body.email });
    const account = await Account.find({ id: user.id });
    return res.json({
      message: "Account Found",
      data: account,
    });
    // Account.findOne({accountNumber:req.params.accountNumber})

    //   .then((account) => {
    //     if (!account) {
    //       return res.status(404).json({
    //         message: "Account not found with id " + req.params.accountNumber,
    //       });
    //     }
    //     res.json({
    //       message: "Account Found",
    //       data: account,
    //     });
    //   })
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        message: "Account not found with id " + req.params.accountNumber,
      });
    }
    return res.status(500).json({
      message: "Error retrieving account with id " + req.params.accountNumber,
    });
  }
};

// Activate or Deactivate an account identified by the accountNumber in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.accountNumber) {
    return res.status(400).json({
      message: "account Number can not be empty",
    });
  }

  // Find account and update it with the request body
  Account.findByIdAndUpdate(
    req.params.accountNumber,
    {
      status: req.body.accountStatus || "active",
    },
    { new: true }
  )
    .then((account) => {
      if (!account) {
        return res.status(404).json({
          message: "account not found with id " + req.params.accountNumber,
        });
      }
      res.json({
        message: "Account updated",
        data: account,
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).json({
          message: "Account not found with id " + req.params.accountNumber,
        });
      }
      return res.status(500).json({
        message: "Error updating account with id " + req.params.accountNumber,
      });
    });
};

// Delete an account with the specified accountNumber in the request
exports.delete = (req, res) => {
  Account.findByIdAndRemove(req.params.accountNumber)
    .then((account) => {
      if (!account) {
        return res.status(404).json({
          message: "account not found with id " + req.params.accountNumber,
        });
      }
      res.json({ message: "Account successfully deleted" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "account not found with id " + req.params.accountNumber,
        });
      }
      return res.status(500).send({
        message: "Could not delete account with id " + req.params.accountNumber,
      });
    });
};