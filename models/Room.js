const mongoose = require("mongoose");
const Room = mongoose.model("Room", {
    title: String,
    rate: Number,
    description: {type: String, maxlength: 1000},
    price: Number,
    room_picture:  Object,
    created: Date,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = Room;