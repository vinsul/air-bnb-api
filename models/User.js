const mongoose = require("mongoose");

const User = mongoose.model("User", {
    email: String,
    username: String,
    name: String,
    description: { type: String, maxlength: 1000 },
    hash: String,
    salt: String,
    token: String
});

module.exports = User;