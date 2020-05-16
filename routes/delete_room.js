const express = require("express");
const Room = require("../models/Room");
const Picture = require("../models/Picture");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const is_authenticated = require("../middleware/is_authenticated");

router.post("/room/delete", is_authenticated, async(req, res) => {
    try {

        if (req.fields._id) {
            const room_to_delete = await Room.findById(req.fields._id);
            const pictures = room_to_delete.room_picture;
            
            pictures.forEach(async (picture) => {
                const pic = await Picture.findById(picture);
                if(pic.is_active){
                    await cloudinary.uploader.destroy(pic.infos.public_id);
                    pic.is_active = false;
                    await pic.save();
                }
            });

            await room_to_delete.remove();

            res.status(200).json({ message: "Room deleted" });
        } else {
            res.status(400).json({ error: "Missing ID" });
        }

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;