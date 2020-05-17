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
        
        const rooms_to_display = await Room.find({location:{ $near :
                {
                    $geometry: { type: "Point",  
                        coordinates: [req.query.longitude, req.query.latitude] },
                    $maxDistance: 20000
                }
            }
        })
        .populate({path: "creator", select: "username profile_picture"})
        .populate("room_picture")
        .limit(20);
        
        if (rooms_to_display.length === 0){
            return res.status(200).json({message: "No room to display"});
        }

        const payload = [];

        for (let i = 0; i < rooms_to_display.length; i++){
            const profile_picture_displayed = {};
            const room_picture_displayed = [];
    
            for (let j = 0; j < rooms_to_display[i].room_picture.length; j++){
                if(rooms_to_display[i].room_picture[j].is_active){
                    room_picture_displayed.push({
                        id: rooms_to_display[i].room_picture[j]._id,
                        secure_url: rooms_to_display[i].room_picture[j].infos.secure_url
                    });
                }
            }
    
            if (rooms_to_display[i].creator.profile_picture){
                const pic = await Picture.findById(rooms_to_display[i].creator.profile_picture);

                if (pic.is_active){
                    profile_picture_displayed.id = rooms_to_display[i].creator.profile_picture;
                    profile_picture_displayed.secure_url = pic.infos.secure_url;
                }                
            }
            
            payload.push({
                id: rooms_to_display[i]._id,
                title: rooms_to_display[i].title,
                rate: rooms_to_display[i].rate,
                description: rooms_to_display[i].description,
                price: rooms_to_display[i].price,
                room_picture: room_picture_displayed,
                creator: {
                    username: rooms_to_display[i].creator.username,
                    profile_picture: profile_picture_displayed
                }
            });
        }
        
        return res.status(200).json({
            count: rooms_to_display.length,
            result: payload
        });

    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;