const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "longer-secret-is-better");
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed, requires authorization" });
  }
};
// module.exports = (req, res, next) => {
//   let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
//   console.log(token)
//   if (!token) {
//     return res.json({
//       success: false,
//       message: "This route requires authentication"
//     });
//   }

//   if (token.startsWith("Bearer ")) {
//     // Remove Bearer from string
//     token = token.slice(7, token.length);
//   }

//   if (token) {
//     jwt.verify(token, "longer-secret-is-better", (err, decoded) => {
//       if (err) {
//         return res.json({
//           success: false,
//           message: "Token is not valid"
//         });
//       } else {
//         req.decoded = decoded;
//         next();
//       }
//     });
//   }
// };