const express = require("express");
const Room = require("../models/Room");
const Picture = require("../models/Picture");

const router = express.Router();

router.get("/room", async(req, res) => {
    try {
        const filter = {};

        if (req.query.id) {
            filter._id = req.query.id;
        }

        const room_to_get = await Room.findOne(filter)
            .populate({ path: "creator", select: "username profile_picture" })
            .populate("room_picture");
        if (!room_to_get) {
            return res.status(400).json({ message: "No room to display" });
        }

        const profile_picture_displayed = {};
        const room_picture_displayed = [];

        for (let i = 0; i < room_to_get.room_picture.length; i++) {
            if (room_to_get.room_picture[i].is_active) {
                room_picture_displayed.push({
                    id: room_to_get.room_picture[i]._id,
                    secure_url: room_to_get.room_picture[i].infos.secure_url,
                });
            }
        }

        if (room_to_get.creator.profile_picture) {
            const pic = await Picture.findById(room_to_get.creator.profile_picture);
            if (pic.is_active) {
                profile_picture_displayed.id = room_to_get.creator.profile_picture;
                profile_picture_displayed.secure_url = pic.infos.secure_url;
            }
        }

        res.status(200).json({
            id: room_to_get._id,
            title: room_to_get.title,
            rate: room_to_get.rate,
            description: room_to_get.description,
            price: room_to_get.price,
            room_picture: room_picture_displayed,
            creator: {
                username: room_to_get.creator.username,
                profile_picture: profile_picture_displayed,
            },
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;