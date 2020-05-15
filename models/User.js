const mongoose = require("mongoose");

const User = mongoose.model("User", {
    email: String,
    username: String,
    name: String,
    description: { type: String, maxlength: 1000 },
    profile_picture: Object,
    hash: String,
    salt: String,
    token: String
});

module.exports = User;