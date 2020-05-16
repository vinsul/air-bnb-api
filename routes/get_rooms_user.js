const express = require("express");
const Room = require("../models/Room");
const User = require("./../models/User");
const Picture = require("../models/Picture");

const router = express.Router();

router.get("/rooms/:user_id", async (req, res) => {
    try {

        const user_to_find = await User.findById(req.params.user_id)
        .populate("profile_picture");

        if(!user_to_find){
            return res.status(400).json({message: "No user matched"});
        }

        const rooms_to_get = await Room.find({creator: req.params.user_id})
        .populate({path: "creator", select: "username profile_picture"})
        .populate("room_picture");

        if(!rooms_to_get){
            return res.status(400).json({message: "No room to display"});
        }

        const payload = [];

        for (let i = 0; i < rooms_to_get.length; i++){
            const profile_picture_displayed = {};
            const room_picture_displayed = [];
    
            for (let j = 0; j < rooms_to_get[i].room_picture.length; j++){
                if(rooms_to_get[i].room_picture[j].is_active){
                    room_picture_displayed.push({
                        id: rooms_to_get[i].room_picture[j]._id,
                        secure_url: rooms_to_get[i].room_picture[j].infos.secure_url
                    });
                }
            }
    
            if (rooms_to_get[i].creator.profile_picture){
                const pic = await Picture.findById(rooms_to_get[i].creator.profile_picture);

                if (pic.is_active){
                    profile_picture_displayed.id = rooms_to_get[i].creator.profile_picture;
                    profile_picture_displayed.secure_url = pic.infos.secure_url;
                }
            }
            
            payload.push({
                id: rooms_to_get[i]._id,
                title: rooms_to_get[i].title,
                rate: rooms_to_get[i].rate,
                description: rooms_to_get[i].description,
                price: rooms_to_get[i].price,
                room_picture: room_picture_displayed,
                creator: {
                    username: rooms_to_get[i].creator.username,
                    profile_picture: profile_picture_displayed
                }
            });
        }
        
        res.status(200).json(payload);

    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;