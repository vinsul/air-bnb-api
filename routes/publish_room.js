const express = require("express");
const Room = require("./../models/Room");
const Picture = require("./../models/Picture");
const cloudinary = require("cloudinary").v2;
const is_authenticated = require("./../middleware/is_authenticated")

const router = express.Router();

router.post("/room/publish", is_authenticated, async (req, res) =>{
    try {
        const room_pictures = [];
        const files_name = Object.keys(req.files);

        for (let i = 0; i < files_name.length; i++){
            if(req.files[files_name[i]].type){
                room_pictures.push(req.files[files_name[i]].path)
            }
        }

        if (files_name.length === 0 || room_pictures.length === 0){
            return res.status(400).json({message: "No picture added !"});
        }

        const room_picture_upload_result = [];

        for (let i = 0; i < room_pictures.length; i++){
            const result = await cloudinary.uploader.upload(room_pictures[i]);
            room_picture_upload_result.push(result);
        }

        const pictures_to_create = [];

        room_picture_upload_result.forEach(async (picture) => {
            const pic_to_create = new Picture({
                type: "room_picture",
                is_active: true,
                infos: picture
            });
            pictures_to_create.push(pic_to_create);
            await pic_to_create.save();
        });
        
        const room_to_publish = new Room({
            title: req.fields.title,
            rate: 0,
            description: req.fields.description,
            price: req.fields.price,
            location: {
                type: "Point",
                coordinates: [Number(req.fields.longitude), Number(req.fields.latitude)]
            },
            room_picture: pictures_to_create,
            created: new Date().toLocaleString(),
            creator: req.user
        });

        await room_to_publish.save();

        const room_picture_displayed = [];
        
        for (let i = 0; i < pictures_to_create.length; i++){
            room_picture_displayed.push({
                id: pictures_to_create[i]._id,
                secure_url: pictures_to_create[i].infos.secure_url
            });
        }

        const room = await Room.findById(room_to_publish._id)
        .populate({path: "creator", select: "username profile_picture"});

        const profile_picture_displayed = {};

        if (room.creator.profile_picture){
            const pic = await Picture.findById(room.creator.profile_picture);
            if (pic.is_active){
                profile_picture_displayed.id = room.creator.profile_picture;
                profile_picture_displayed.secure_url = pic.infos.secure_url;
            }
        }

        res.status(200).json({
            id: room._id,
            title: room.title,
            rate: room.rate,
            description: room.description,
            price: room.price,
            location: room.location,
            room_picture: room_picture_displayed,
            creator: {
                username: room.creator.username,
                profile_picture: profile_picture_displayed
            }
        });

    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

module.exports = router;