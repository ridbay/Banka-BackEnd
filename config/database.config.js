
module.exports = {
  local: "mongodb://localhost:27017/banka-db",
  live:
    "mongodb+srv://process.env.DB_USERNAME:process.env.DB_PASSWORD@ridwan.786um.mongodb.net/process.env.DB_NAME?retryWrites=true&w=majority",
};
