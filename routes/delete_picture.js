const express = require("express");
const User = require("./../models/User");
const Room = require("./../models/Room");
const Picture = require("./../models/Picture");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});
const isAuthenticated = require("./../middleware/isAuthenticated")
const router = express.Router();

router.post("/picture/delete/:picture_id", isAuthenticated, async (req, res) => {
    try {
        const pictureToDelete = await Picture.findById(req.params.picture_id);
        if (!pictureToDelete.isActive){
            return res.status(400).json({message: "Picture already deleted"});
        }
        if (pictureToDelete.type === "profile_picture") {
            if (pictureToDelete._id.toString() !== req.user.profile_picture.toString()){
                return res.status(401).json({message: "Unauthorized !"});
            }
            
        }
        if (pictureToDelete.type === "room_picture"){
            const room = await Room.findOne({room_picture: req.params.picture_id});
            if(room.creator.toString() !== req.user._id.toString()){
                return res.status(401).json({message: "Unauthorized !"});
            }
        }
        const result = await cloudinary.uploader.destroy(pictureToDelete.infos.public_id);
        pictureToDelete.isActive = false;
        await pictureToDelete.save();
        res.status(400).json({
            message: "Picture deleted",
            result: result,
            status_isActive: pictureToDelete.isActive
        });

    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;