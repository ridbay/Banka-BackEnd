const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    title: String,
    content: String,
    // published: Boolean
}, {
    timestamps: true
});


//To use this app with a front-end that needs id field instead of _id, override toJSON method that map default object to a custom object.

NoteSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

module.exports = mongoose.model('Note', NoteSchema);