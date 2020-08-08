const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

// const userSchema = new Schema({
//     firstName: String,
//     lastName: String,
//     email: String,
//     password: String,
//      type: String,
//      isAdmin: Boolean
//  });


let userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email:{
        type:String,
        unique: true
    },
    password:{
        type: String
    }
}, {collection: 'users'});

userSchema.plugin(uniqueValidator, {message: 'Email already in use.'});

module.exports = mongoose.model("User", userSchema);