const mongoose = require("mongoose");

const User = mongoose.model("User",{
    email: String,
    username: String,
    name: String,
    description: String,
    hash: String,
    salt: String,
    token: String
});

module.exports = User;