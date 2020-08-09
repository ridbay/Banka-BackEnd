const Account = require("../models/account.model");

// Create and Save a new Account
exports.create = (req, res) => {
  // Validate request
  if (!req.body.accountNumber) {
    return res.status(400).send({
      message: "Account Number content can not be empty",
    });
  }

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
  account
    .save()
    .then((data) => {
      res.json({
        message: "Bank account created",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while creating the account.",
      });
    });
};

// Retrieve and return all accounts from the database.
exports.findAll = (req, res) => {
  Account.find()
    .then((accounts) => {
      res.json({
        message: "All accounts retrieved",
        data: accounts,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while retrieving accounts.",
      });
    });
};

// Find a single account with a accountId
exports.findOne = (req, res) => {
  Account.findById(req.params.accountId)
    .then((account) => {
      if (!account) {
        return res.status(404).json({
          message: "Account not found with id " + req.params.accountId,
        });
      }
      res.json({
        message: "Account Found",
        data: account,
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).json({
          message: "Account not found with id " + req.params.accountId,
        });
      }
      return res.status(500).json({
        message: "Error retrieving account with id " + req.params.accountId,
      });
    });
};

// Activate or Deactivate an account identified by the accountId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.accountNumber) {
    return res.status(400).json({
      message: "account Number can not be empty",
    });
  }

  // Find account and update it with the request body
  Account.findByIdAndUpdate(
    req.params.accountId,
    {
      status: req.body.accountStatus || "active",
    },
    { new: true }
  )
    .then((account) => {
      if (!account) {
        return res.status(404).json({
          message: "account not found with id " + req.params.accountId,
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
          message: "Account not found with id " + req.params.accountId,
        });
      }
      return res.status(500).json({
        message: "Error updating account with id " + req.params.accountId,
      });
    });
};

// Delete an account with the specified accountId in the request
exports.delete = (req, res) => {
  Account.findByIdAndRemove(req.params.accountId)
    .then((account) => {
      if (!account) {
        return res.status(404).json({
          message: "account not found with id " + req.params.accountId,
        });
      }
      res.json({ message: "Account successfully deleted" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "account not found with id " + req.params.accountId,
        });
      }
      return res.status(500).send({
        message: "Could not delete account with id " + req.params.accountId,
      });
    });
};
