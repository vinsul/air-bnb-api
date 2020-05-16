const mongoose = require("mongoose");

const Room = mongoose.model("Room", {
    title: String,
    rate: Number,
    description: { type: String, max_length: 1000 },
    price: Number,
    room_picture: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Picture"
    }],
    created: Date,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = Room;