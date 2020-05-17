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
    location: {
        type: {type: String, default: "Point"},
        coordinates: {type: [Number], default: [0, 0]}
       },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

Room.collection.createIndex( {location : "2dsphere" } )

module.exports = Room;