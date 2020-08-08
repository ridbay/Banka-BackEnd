const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Sign up and Save a new User
exports.signup = (req, res) => {
  // Validate request
  if (!req.body.firstName && !req.body.lastName && !req.body.email) {
    return res.status(400).send({
      message: "Those fields can not be empty",
    });
  }

  // Create a User
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  // Save User in the database
  user
    .save()
    .then((data) => {
      res.status(201).json({
        message: "User successfully created!",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Sign in an existing User
exports.signin = (req, res) => {
  // Validate request
  if (!req.body.email && !req.body.password) {
    return res.status(400).send({
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
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((response) => {
      if (!response) {
        return res.status(401).json({
          message: "Password Authentication failed",
        });
      }
      let jwtToken = jwt.sign(
        {
          email: getUser.email,
          userId: getUser.id,
        },
        "longer-secret-is-better",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token: jwtToken,
        expiresIn: 3600,
        msg: getUser,
      });
    })
    .catch((error) => {
      return res.status(401).json({
        message: "Authentication failed",
      });
    });
};

// Retrieve and return all users from the database.
exports.findAllUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.json({
        message: "User successfully created!",
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
  User.findById(req.params.id).then((user) => {
    if (!user) {
      return res.status(404).json({
        message: "User not found with id " + req.params.noteId,
      });
    }
    return res.json({
      message: "User found!",
      data: user,
    });
  }).catch(error=>{
    if(err.kind === 'ObjectId') {
        return res.status(404).json({
            message: "User not found with id " + req.params.noteId
        });                
    }
    return res.status(500).json({
        message: "Error retrieving user with id " + req.params.noteId
    }); 
  })
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
        return res.status(404).json({
          message: "Note not found with id " + req.params.noteId,
        });
      }
      res.json({
        message: "User profile updated successfully",
        data: user
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
        return res.status(404).json({
          message: "Usernot found with id " + req.params.noteId,
        });
      }
      res.json({ message: "User deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).json({
          message: "User not found with id " + req.params.noteId,
        });
      }
      return res.status(500).json({
        message: "Could not delete user with id " + req.params.noteId,
      });
    });
};
