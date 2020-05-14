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
        const profile_picture = req.files.profile_picture.path;
        const pp_upload_result = await cloudinary.uploader.upload(profile_picture);
        const room_pictures = [
            req.files.room_picture1.path,
            req.files.room_picture2.path
        ];
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
            pictures: {
                user_picture: pp_upload_result,
                room_picture: rp_upload_result
            },
            created: new Date().toLocaleString(),
            creator: req.User
        });
        await roomToPublish.save();

        res.status(200).json({
            message: "updated"
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

module.exports = router;