const Transaction = require("../models/transaction.model");
const Account = require("../models/account.model");

// Create Credit and Save a new Transaction
exports.createCredit = async (req, res) => {
  //   Validate request
  if (!req.body.type) {
    return res.status(400).json({
      message: "Select the type of transaction; Credit",
    });
  }
  try {
    const account = await Account.findOne({
      accountNumber: req.params.accountNumber,
    });
    console.log("Account found", account);
    // Create a Transaction
    const transaction = new Transaction({
      type: req.body.type,
      // accountNumber: Number(req.body.accountNumber),
      amount: Number(req.body.amount),
      // cashier: Number(req.body.cashier),
      transactionType: req.body.transactionType,
      accountBalance: req.body.accountBalance,
    });

    // Save Transaction in the database
    const savedTransaction = await transaction.save();
    console.log("Saved transaction", savedTransaction);

    account.transactions.push(savedTransaction.id);
    let newBalance = account.accountBalance + req.body.amount;

    let updateAccount = await Account.findOneAndUpdate(
      { accountNumber: req.params.accountNumber },
      {
        accountBalance: newBalance,
      },
      { new: true }
    );

    console.log("Account balance", account.accountBalance);
    res.json({
      message: "Transaction created",
      data: updateAccount,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message:
        error.message || "Some error occurred while creating the transaction.",
    });
  }
};

// Create Debit and Save a new Transaction
exports.createDebit = (req, res) => {
  //   Validate request
  if (!req.body.type) {
    return res.status(400).json({
      message: "Select the type of transaction; Debit",
    });
  }

  // Create a Transaction
  const transaction = new Transaction({
    type: req.body.type,
    accountNumber: Number(req.body.accountNumber),
    amount: Number(req.body.amount),
    cashier: Number(req.body.cahier),
    transactionType: req.body.transactionType,
    accountBalance: req.body.accountBalance,
  });

  // Save Transaction in the database
  account
    .save()
    .then((data) => {
      res.json({
        message: "Transaction created",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while creating the transaction.",
      });
    });
};

// Retrieve and return all transactions from the database.
exports.findAll = (req, res) => {
  Transaction.find()
    .then((transactions) => {
      res.json({
        message: "All transactions retrieved",
        data: transactions,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while retrieving transactions.",
      });
    });
};

// Find a single Transaction with a accountNumber
exports.findOne = (req, res) => {
  Account.findById(req.params.accountNumber)
    .then((account) => {
      if (!account) {
        return res.status(404).json({
          message: "Account not found with id " + req.params.accountNumber,
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
          message: "Account not found with id " + req.params.accountNumber,
        });
      }
      return res.status(500).json({
        message: "Error retrieving account with id " + req.params.accountNumber,
      });
    });
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
