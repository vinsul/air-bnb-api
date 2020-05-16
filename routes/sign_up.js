const express = require("express");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const User = require("./../models/User");

const router = express.Router();

router.post("/sign_up", async(req, res) => {
    try {
        const exist = await User.findOne({ email: req.fields.email })
        if (exist) {
            return res.status(400).json({ message: "Already exist" })
        }
        if (!req.fields.password) {
            return res.status(400).json({ error: "password parameter missing" })
        }
        if (!req.fields.username) {
            return res.status(400).json({ error: "username parameter missing" })
        }
        if (!req.fields.name) {
            return res.status(400).json({ error: "name parameter missing" })
        }
        if (!req.fields.email) {
            return res.status(400).json({ error: "email parameter missing" })
        }

        const salt = uid2(15);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);
        const token = uid2(15);

        const new_user = new User({
            email: req.fields.email,
            username: req.fields.username,
            name: req.fields.name,
            description: req.fields.description,
            hash: hash,
            salt: salt,
            token: token
        });
        await new_user.save();

        return res.status(200).json({ message: "Account created" });

    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

module.exports = router;