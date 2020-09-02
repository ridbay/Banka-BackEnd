const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  imageUrl: String,
});

//To use this app with a front-end that needs id field instead of _id, override toJSON method that map default object to a custom object.

imageSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model("Image", imageSchema, "images");
