const express = require("express");
const Room = require("./../models/Room");
const Picture = require("./../models/Picture");

const router = express.Router();

router.get("/room", async (req, res) => {
    try {
        const filter = {};
        if(req.query.id){
            filter._id = req.query.id;
        }
        const roomToGet = await Room.findOne(filter)
        .populate({path: "creator", select: "username profile_picture"})
        .populate("room_picture");
        const pp_displayed = {};
        const rp_displayed = [];
        for (let i = 0; i < roomToGet.room_picture.length; i++){
            if(roomToGet.room_picture[i].isActive){
                rp_displayed.push({
                    id: roomToGet.room_picture[i]._id,
                    secure_url: roomToGet.room_picture[i].infos.secure_url
                });
            }
        }
        if(roomToGet.creator.profile_picture){
            const pic = await Picture.findById(roomToGet.creator.profile_picture);
            if(pic.isActive){
                pp_displayed.id = roomToGet.creator.profile_picture;
                pp_displayed.secure_url = pic.infos.secure_url;
            }
        }
        res.status(200).json({
            id: roomToGet._id,
            title: roomToGet.title,
            rate: roomToGet.rate,
            description: roomToGet.description,
            price: roomToGet.price,
            room_picture: rp_displayed,
            creator: {
                username: roomToGet.creator.username,
                profile_picture: pp_displayed
            }
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;