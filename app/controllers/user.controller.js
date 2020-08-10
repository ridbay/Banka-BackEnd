const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let secretWord = require("../config/index");

// Sign up and Save a new User
exports.signup = (req, res) => {
  // Validate request
  if (!req.body.firstName && !req.body.lastName && !req.body.email) {
    return res.status(400).json({
      message: "Those fields can not be empty",
    });
  }

  bcrypt.hash(req.body.password, 10).then((hash) => {
    // Create a User
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
      type: "client", // client or staff
      isAdmin: false,
    });

    // Save User in the database
    user
      .save()
      .then((user) => {
        res.status(201).json({
          message: "User successfully created!",
          data: user,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message:
            err.message || "Some error occurred while creating the User.",
        });
      });
  });
};

// Sign in an existing User
exports.signin = (req, res) => {
  // Validate request
  if (!req.body.email && !req.body.password) {
    return res.status(400).json({
      message: "Those fields can not be empty",
    });
  }
  let getUser;
  // find User in the database
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed, No user with that email",
        });
      }
      getUser = user;
      return bcrypt.compare(req.body.password, getUser.password);
    })
    .then((response) => {
      // if (!response) {
      //   return res.status(401).json({
      //     message: "Password doesn't match",
      //   });
      // }

      if (response) {
        console.log("authentication successful");
        let jwtToken = jwt.sign(
          {
            email: getUser.email,
            userId: getUser.id,
          },
          secretWord.secret,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          token: jwtToken,
          expiresIn: 3600,
          data: getUser,
          message: "authentication successful",
        });
      } else {
        console.log("authentication failed. Password doesn't match");
        return res.status(401).json({
          message: "authentication failed. Password doesn't match",
        });
      }
    })
    .catch((error) => {
      return res.status(401).json({
        message: "Authentication failed",
        data: error,
      });
    });
};

// Retrieve and return all users from the database.
exports.findAllUsers = (req, res) => {
  User.find()
    .then((users) => {
      console.log(users);
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
  return User.findById(req.params.id)
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
