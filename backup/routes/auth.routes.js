const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const userSchema = require("../models/User");
const authorize = require("../middlewares/auth");
const { check, validationResult } = require("express-validator");

//Sign-Up

// router.post(
//   "/signup",
//   [
//     check("firstName")
//       .not()
//       .isEmpty()
//       .isLength({ min: 3 })
//       .withMessage("First Name must be atleast 3 characters long"),
//     check("lastName")
//       .not()
//       .isEmpty()
//       .isLength({ min: 3 })
//       .withMessage("First Name must be atleast 3 characters long"),
//     check("email", "Email is required").not().isEmpty(),
//     check("password", "Password should be between 5 to 8 characters long")
//       .not()
//       .isEmpty()
//       .isLength({ min: 5, max: 8 }),
//   ],
//   (req, res, next) => {
//     const errors = validationResult(req);
//     console.log(req.body);
//     if (!errors.isEmpty()) {
//       return res.status(422).json(errors.array());
//     } else {
//       bcrypt.hash(req.body.confirmPassword, 10).then((hash) => {
//         const user = new userSchema({
//           firstName: req.body.firstName,
//           lastName: req.body.lastName,
//           email: req.body.email,
//           password: hash,
//         });
//         user
//           .save()
//           .then((response) => {
//             res.status(201).json({
//               message: "User successfully created",
//               result: response,
//             });
//           })
//           .catch((error) => {
//             res.status(500).json({
//               error: error,
//             });
//           });
//       });
//     }
//   }
// );


//Sign up without auth 
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
      const user = new userSchema({
        firstName: req.body.firstName,
        lastName:req.body.lastName,
          email: req.body.email,
          password: hash
      });
      user.save().then((response) => {
          res.status(201).json({
              message: "User successfully created!",
              result: response
          });
      }).catch(error => {
          res.status(500).json({
              error: error
          });
      });
  });
});

//Sign-in

router.post("/signin", (req, res, next) => {
  let getUser;
  userSchema
    .findOne({
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
          userId: getUser._id,
        },
        "longer-secret-is-better",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token: jwtToken,
        expiresIn: 3600,
        msg: getUser
        
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Authentication failed",
      });
    });
});

//Get Users
router.get("/users", (req, res, next) => {
  userSchema.find((error, response) => {
    if (error) {
      return next(error);
    } else {
      return res.status(200).json(response);
    }
  });
});

//Get a user profile

router.route("/user-profile/:id").get(authorize, (req, res, next) => {
  userSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      return res.status(200).json({
        msg: data,
      });
    }
  });
});

//Update User
router.route("/update-user/:id").put((req, res, next) => {
  userSchema.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        return res.json(data);
      }
    }
  );
});

//Delete a User
router.route("/delete-user/:id").delete((req, res, next) => {
  userSchema.findByIdAndDelete(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

module.exports = router;
