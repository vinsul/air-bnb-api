const express = require("express");
const Room = require("../models/Room");
const Picture = require("../models/Picture");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});
const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/room/delete", isAuthenticated, async(req, res) => {
    try {
        if (req.fields._id) {
            const roomToDelete = await Room.findById(req.fields._id);
            const pictures = roomToDelete.room_picture;
            pictures.forEach(async (picture) => {
                const pic = await Picture.findById(picture);
                if(pic.isActive){
                    await cloudinary.uploader.destroy(pic.infos.public_id);
                    pic.isActive = false;
                    await pic.save();
                }
            });
            await roomToDelete.remove();
            res.status(200).json({ message: "Room deleted" });
        } else {
            res.status(400).json({ error: "Missing ID" });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
module.exports = router;