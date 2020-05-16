const express = require("express");
const haversine = require("haversine");
const Room = require("../models/Room");
const User = require("./../models/User");
const Picture = require("../models/Picture");
   
const router = express.Router();

const distance = (a, b) => {
    const start = {
        latitude: a.latitude,
        longitude: a.longitude
      }
      
      const end = {
        latitude: b.latitude,
        longitude: b.longitude
      }
    result = haversine(start, end);
    return(result);
}

router.get("/rooms/around", async (req, res) => {
    try {
        const all_rooms = await Room.find()
        .populate({path: "creator", select: "username profile_picture"})
        .populate("room_picture");

        const rooms_to_display = [];
        const distances = []

        for (let i = 0; i < all_rooms.length; i++){
            const room_location = all_rooms[i].location;
            const user_location = req.fields.user_location;
            distances.push(distance(room_location, user_location));
            if(distance(room_location, user_location) <= 20){
                rooms_to_display.push(all_rooms[i]);
            }
        }
        
        if (rooms_to_display.length === 0){
            res.status(200).json({message: "No room to display"});
        }

        return res.status(200).json(rooms_to_display);

    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;