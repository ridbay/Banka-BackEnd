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

    let newBalance = account.accountBalance + req.body.amount;

    let updateAccount = await Account.findOneAndUpdate(
      { accountNumber: req.params.accountNumber },
      {
        accountBalance: newBalance,
      },
      { new: true }
    );

    // Create a Transaction
    const transaction = new Transaction({
      type: req.body.type,
      accountNumber: Number(req.params.accountNumber),
      amount: Number(req.body.amount),
      cashier: Number(req.body.cashier),
      oldBalance: account.accountBalance,
      newBalance,
    });

    // Save Transaction in the database
    const savedTransaction = await transaction.save();

    account.transactions.push(savedTransaction.id);
    res.status(200).json({
      message: "Credit Transaction created",
      data: savedTransaction,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Some error occurred while creating the transaction.",
    });
  }
};

// Create Debit and Save a new Transaction
exports.createDebit = async (req, res) => {
  //   Validate request
  if (!req.body.type) {
    return res.status(400).json({
      message: "Select the type of transaction; Debit",
    });
  }
  try {
    const account = await Account.findOne({
      accountNumber: req.params.accountNumber,
    });

    let newBalance = account.accountBalance - req.body.amount;

    let updateAccount = await Account.findOneAndUpdate(
      { accountNumber: req.params.accountNumber },
      {
        accountBalance: newBalance,
      },
      { new: true }
    );

    // Create a Transaction
    const transaction = new Transaction({
      type: req.body.type,
      accountNumber: Number(req.params.accountNumber),
      amount: Number(req.body.amount),
      cashier: Number(req.body.cashier),
      transactionType: req.body.transactionType,
      oldBalance: account.accountBalance,
      newBalance,
    });

    // Save Transaction in the database
    const savedTransaction = await transaction.save();

    account.transactions.push(savedTransaction.id);
    res.json({
      message: " Debit Transaction created",
      data: savedTransaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Some error occurred while creating the transaction.",
      data: error.message,
    });
  }
};

// Retrieve and return all transactions from the database.
exports.findAll = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json({
      message: "All transactions retrieved",
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Some error occurred while retrieving transactions.",
      data: error.message,
    });
  }
};

// Find a single Transaction with an ID
exports.findOne = (req, res) => {
  Transaction.findById(req.params.id)
    .then((transaction) => {
      if (!transaction) {
        return res.status(404).json({
          message: "Transaction not found with id: " + req.params.id,
        });
      }
      res.json({
        message: "Transaction Found",
        data: transaction,
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).json({
          message: "Transaction not found with id " + req.params.id,
        });
      }
      return res.status(500).json({
        message: "Error retrieving transaction with id " + req.params.id,
      });
    });
};

// Delete a transaction with the specified id in the request
exports.delete = (req, res) => {
  Transaction.findByIdAndRemove(req.params.id)
    .then((transaction) => {
      if (!transaction) {
        return res.status(404).json({
          message: "transaction not found with id " + req.params.id,
        });
      }
      res.status(200).json({ message: "Transaction successfully deleted" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "transaction not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Could not delete transaction with id " + req.params.id,
      });
    });
};
