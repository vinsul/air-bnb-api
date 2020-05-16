const express = require("express");
const User = require("./../models/User");
const Room = require("./../models/Room");
const Picture = require("./../models/Picture");
const cloudinary = require("cloudinary").v2;
const is_authenticated = require("./../middleware/is_authenticated")

const router = express.Router();

router.post("/picture/delete/:picture_id", is_authenticated, async (req, res) => {
    try {

        const picture_to_delete = await Picture.findById(req.params.picture_id);

        if (!picture_to_delete.is_active){
            return res.status(400).json({message: "Picture already deleted"});
        }
        if (picture_to_delete.type === "profile_picture") {
            if (picture_to_delete._id.toString() !== req.user.profile_picture.toString()){
                return res.status(401).json({message: "Unauthorized !"});
            } 
        }
        if (picture_to_delete.type === "room_picture"){
            const room = await Room.findOne({room_picture: req.params.picture_id});
            if(room.creator.toString() !== req.user._id.toString()){
                return res.status(401).json({message: "Unauthorized !"});
            }
        }

        const result = await cloudinary.uploader.destroy(picture_to_delete.infos.public_id);
        picture_to_delete.is_active = false;
        await picture_to_delete.save();

        res.status(400).json({
            message: "Picture deleted",
            result: result,
            status_is_active: picture_to_delete.is_active
        });
        
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;