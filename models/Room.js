const mongoose = require("mongoose");
const Room = mongoose.model("Room", {
    title: String,
    rate: Number,
    description: String,
    price: Number,
    pictures: {
        user_picture: Object,
        romm_picture: Object
    },
    created: Date,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = Room;