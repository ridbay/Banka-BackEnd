const Account = require("../models/account.model");
const User = require("../models/user.model");

// Create and Save a new Account
exports.create = async (req, res) => {
  let errors = [];
  if (!req.body.email) {
    errors.push({ message: "Email is mandatory" });
  }
  if (!req.body.type) {
    errors.push({ message: "type is mandatory" });
  }

  if (errors.length > 0) {
    res.json({
      errors,
    });
  } else {
    try {
//Find a user
      const user = await User.findOne({ email: req.body.email });

      // Create a Account
      const account = new Account({
        email: req.body.email,
        accountNumber: Math.floor(
          Math.random() * (9999999999 - 1111111111) + 1111111111
        ),
        type: req.body.type,
        status: "active",
        openingBalance: Number(req.body.openingBalance) || 0,
        owner: user.id
      });

      // Save Account in the database
      const savedAccount = await account.save();
      // Adds account to User
      // Then saves User to database
      user.accounts.push(savedAccount.id);

      res.json({ message: "Bank account created", data: savedAccount, user: user });
    } catch (err) {
      res.status(500).json({
        message:
          err.message || "Some error occurred while creating the account.",
      });
    }
  }
};

// Retrieve and return all accounts from the database.
exports.findAll = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const accounts = await Account.find();
    const accounts2 = await accounts.populate("accounts").exec();
    console.log(accounts2);
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
  try {
    Account.findOne({ email: req.body.email })
      .populate("user")
      .exec((err, user) => {
        console.log("Populated Account " + user);
        return res.json({
          message: "Account Found",
          data: user,
        });
      });

    // const user = await User.findOne({ email: req.body.email });
    // console.log("user", user.email)
    // const account = await Account.find({ email: user.email });
    // console.log("account", account)
    // return res.json({
    //   message: "Account Found",
    //   data: account,
    // });
    // Account
    // .find({ accountNumber: req.params.accountNumber })
    // .populate('user')
    // .exec(function(err, account) {
    //   if (err) return next(err);
    //   return res.json({
    //       message: "Account Found",
    //       data: account,
    //     });
    // });
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
  // if (!req.body.accountNumber) {
  //   return res.status(400).json({
  //     message: "account Number can not be empty",
  //   });
  // }

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
