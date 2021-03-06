const User = require("../models/user.model");
const Account = require("../models/account.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let secretWord = require("../config/index");

// Sign up and Save a new User

exports.signup = async (req, res) => {
  let errors = [];

  if (!req.body.firstName) {
    errors.push({ message: "First Name is mandatory" });
  }
  if (!req.body.lastName) {
    errors.push({ message: "Last Name is mandatory" });
  }
  if (!req.body.email) {
    errors.push({ message: "Email is mandatory" });
  }
  if (!req.body.password) {
    errors.push({ message: "Password is mandatory" });
  }
  if (errors.length > 0) {
    res.json({
      errors,
    });
  } else {
    const { firstName, lastName, email, password } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if (user) {
        return res.status(400).json({
          data: "User Already Exists",
        });
      }
      user = new User({
        firstName,
        lastName,
        email,
        password,
        type: "client", // client or staff
        isAdmin: false,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      const savedUser = await user.save();

      //Link account with new User created
      // const account = new Account({
      //   owner: user.id,
      // });
      // let savedAccount = await account.save();

      res.status(201).json({
        message: "User successfully created!",
        data: savedUser,
      });

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        secretWord.secret,
        {
          expiresIn: 10000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      res.status(500).json({ message: "Error in Saving", data: err });
    }
  }
};

// Sign in an existing User
exports.signin = async (req, res) => {
  // Validate request
  let errors = [];

  if (!req.body.email) {
    errors.push({ message: "Email is mandatory" });
  }
  if (!req.body.password) {
    errors.push({ message: "Password is mandatory" });
  }
  if (errors.length > 0) {
    res.status(400).json({
      data: errors,
    });
  } else {
    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist",
        });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !",
        });

      const payload = {
        user: {
          id: user.id,
        },
      };

      let jwtToken = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        secretWord.secret,
        { expiresIn: 3600 }
      );

      return res.status(200).json({
        token: jwtToken,
        expiresIn: 3600,
        data: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server Error",
        data: error,
      });
    }
  }
};
// Retrieve and return all users from the database.
exports.findAllUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.json({
        message: "Users successfully found!",
        data: users,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving notes.",
      });
    });
};

//Get a user profile
exports.getOneUser = (req, res, next) => {
  return User.findOne({ email: req.body.email })
    .populate("accounts")
    .exec((err, user) => {
      if (!user) {
        res.status(404).json({
          message: "User not found with id " + req.params.noteId,
        });
      }
      res.json({
        message: "User found!",
        data: user,
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        res.status(404).json({
          message: "User not found with id " + req.params.noteId,
        });
      }
      res.status(500).json({
        message: "Error retrieving user with id " + req.params.noteId,
      });
    });
  // User.findById(req.params.id)
  //   .then((user) => {
  //     if (!user) {
  //       res.status(404).json({
  //         message: "User not found with id " + req.params.noteId,
  //       });
  //     }
  //     res.json({
  //       message: "User found!",
  //       data: user,
  //     });
  //   })
  // .catch((err) => {
  //   if (err.kind === "ObjectId") {
  //     res.status(404).json({
  //       message: "User not found with id " + req.params.noteId,
  //     });
  //   }
  //   res.status(500).json({
  //     message: "Error retrieving user with id " + req.params.noteId,
  //   });
  // });
};

// Update a note identified by the noteId in the request
exports.updateUser = (req, res) => {
  // Validate Request
  // if (!req.body.content) {
  //   return res.status(400).json({
  //     message: "Note content can not be empty",
  //   });
  // }

  // Find user and update it with the request body
  User.findByIdAndUpdate(
    req.params.userId,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        res.status(404).json({
          message: "Note not found with id " + req.params.noteId,
        });
      }
      res.json({
        message: "User profile updated successfully",
        data: user,
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).json({
          message: "User not found with id " + req.params.noteId,
        });
      }
      return res.status(500).json({
        message: "Error updating user with id " + req.params.noteId,
      });
    });
};

// Delete a note with the specified noteId in the request
exports.deleteUser = (req, res) => {
  User.findByIdAndRemove(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).json({
          message: "User not found with id " + req.params.noteId,
        });
      }
      res.json({ message: "User deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        res.status(404).json({
          message: "User not found with id " + req.params.noteId,
        });
      }
      return res.status(500).json({
        message: "Could not delete user with id " + req.params.noteId,
      });
    });
};

//Find all admins
exports.findAllAdmins = (req, res) => {
  User.find({ isAdmin: true })
    .then((data) => {
      res.json({ message: "All admin accounts", data: data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving admins.",
      });
    });
};

//Delete all Users
exports.deleteAll = (req, res) => {
  User.deleteMany({})
    .then((data) => {
      res.json({
        message: `${data.deletedCount} Users were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Some error occurred while removing all users.",
      });
    });
};
