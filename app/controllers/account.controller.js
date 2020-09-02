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
        owner: user.id,
      });

      // Save Account in the database
      const savedAccount = await account.save();
      // Adds account to User
      // Then saves User to database
      user.accounts.push(savedAccount.id);

      res.json({
        message: "Bank account created",
        data: savedAccount,
        user: user,
      });
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
    if (!user) {
      return res.status(200).json({
        message: "User Not Found",
      });
    }

    const accounts = await Account.find({ owner: user.id });
    // console.log("account", account);
    return res.json({
      message: "Accounts Found",
      data: accounts,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Some error occurred while retrieving accounts.",
    });
  }
};

// Find a single account with a accountNumber
exports.findOne = async (req, res) => {
  try {
    const account = await Account.find({
      accountNumber: req.params.accountNumber,
    }).populate("owner");
    return res.json({
      message: "Account Found",
      data: account,
    });
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
exports.update = async (req, res) => {
  let errors = [];
  if (!req.body.email) {
    errors.push({ message: "Email is mandatory" });
  }
  if (!req.body.status) {
    errors.push({ message: "Account status is mandatory" });
  }

  if (errors.length > 0) {
    res.json({
      errors,
    });
  } else {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({
          message: "User Not Found",
        });
      }
      let account = await Account.findOneAndUpdate(
        { accountNumber: req.params.accountNumber },
        {
          status: req.body.status,
        },
        { new: true }
      );
      res.json({
        message: "Account updated",
        data: account,
      });
    } catch (error) {
      if (error.kind === "ObjectId") {
        return res.status(404).json({
          message: "Account not found with id " + req.params.accountNumber,
          data: error,
        });
      }
      return res.status(500).json({
        message: "Error updating account with id " + req.params.accountNumber,
        data: error,
      });
    }
  }
  // Find account and update it with the request body
};

// Delete an account with the specified accountNumber in the request
// exports.delete = async (req, res) => {
//   let errors = [];
//   if (!req.body.email) {
//     errors.push({ message: "Email is mandatory" });
//   }
//   if (errors.length > 0) {
//     res.json({
//       errors,
//     });
//   } else {
//     try {
//       Account.findOneAndDelete(
//         { accountNumber: req.params.accountNumber },
//         function (err) {
//           if (err) console.log(err);
//           console.log("Successful deletion");
//           res.json({
//             message: "Account Deleted",
//             // data: account,
//           });
//         }
//       );
//       // let account = await Account.findOneAndDelete({
//       //   accountNumber: req.params.accountNumber,
//       // });
//       // console.log(account);
//       // res.json({
//       //   message: "Account updated",
//       //   data: account,
//       // });
//     } catch (error) {
//       return res.json({ data: error });
//     }
//   }

//   // Account.findOneAndDelete({ accountNumber: req.params.accountNumber })
//   //   .then((account) => {
//   //     if (!account) {
//   //       return res.status(404).json({
//   //         message: "account not found with id " + req.params.accountNumber,
//   //       });
//   //     }
//   //     res.json({ message: "Account successfully deleted" });
//   //   })
//   //   .catch((err) => {
//   //     if (err.kind === "ObjectId" || err.name === "NotFound") {
//   //       return res.status(404).send({
//   //         message: "account not found with id " + req.params.accountNumber,
//   //       });
//   //     }
//   //     return res.status(500).send({
//   //       message: "Could not delete account with id " + req.params.accountNumber,
//   //     });
//   //   });
// };

// exports.delete = (req, res) => {
//   const id = req.params.id;

//   Account.findByIdAndRemove(id)
//     .then(data => {
//       if (!data) {
//         res.status(404).send({
//           message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
//         });
//       } else {
//         res.send({
//           message: "Tutorial was deleted successfully!"
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Could not delete Tutorial with id=" + id
//       });
//     });
// };

exports.delete = async (req, res) => {
  try {
    const findAccount = await Account.findOne({ accountNumber: req.params.accountNumber});
    if (!findAccount) {
      return res.status(400).json({
        message: `Account Number Not Found`,
      });
    }
    const account = await Account.deleteOne({accountNumber: req.params.accountNumber})

    if (!account) res.status(404).send("No item found")
    res.status(200).json({
      data:`Account with account number ${req.params.accountNumber} successfully deleted`
    })
  } catch (err) {
    res.status(500).send(err)
  }
}