const express = require("express");
const Room = require("./../models/Room");
const User = require("./../models/User");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});
const isAuthenticated = require("./../middleware/isAuthenticated")
const router = express.Router();

router.post("/room/publish", isAuthenticated, async (req, res) =>{
    try {
        const room_pictures = [];
        const files_name = Object.keys(req.files);
        for (let i = 0; i < files_name.length; i++){
            if(req.files[files_name[i]].type){
                room_pictures.push(req.files[files_name[i]].path)
            }
        }
        if(files_name.length === 0 || room_pictures.length === 0){
            return res.status(400).json({message: "No picture added !"});
        }
        const rp_upload_result = [];
        for(let i = 0; i < room_pictures.length; i++){
            const result = await cloudinary.uploader.upload(room_pictures[i]);
            rp_upload_result.push(result);
        }
        const roomToPublish = new Room({
            title: req.fields.title,
            rate: 0,
            description: req.fields.description,
            price: req.fields.price,
            room_picture: rp_upload_result,
            created: new Date().toLocaleString(),
            creator: req.user
        });
        await roomToPublish.save();
        const rp_displayed = [];
        for (let i = 0; i < rp_upload_result.length; i++){
            rp_displayed.push({secure_url: rp_upload_result[i].secure_url});
        }

        const room = await Room.findById(roomToPublish._id).populate({path: "creator", select: "username profile_picture"});
        const pp_displayed = {};
        if(room.creator.profile_picture){
            pp_displayed.secure_url = room.creator.profile_picture.secure_url;
        }
        res.status(200).json({
            id: room._id,
            title: room.title,
            rate: room.rate,
            description: room.description,
            price: room.price,
            room_picture: rp_displayed,
            creator: {
                username: room.creator.username,
                profile_picture: pp_displayed
            }
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

module.exports = router;