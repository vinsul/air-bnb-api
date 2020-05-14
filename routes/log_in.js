const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

router.post("/log_in", async(req, res) => {
    try {
        const userFinded = await User.findOne({ email: req.fields.email });

        if (!userFinded) {
            return res.status(400).json({ message: "Account not find" });
        }
        if (userFinded) {
            const passwordUser = req.fields.password;
            const userHash = SHA256(passwordUser + userFinded.salt).toString(
                encBase64
            );
            if (userFinded.hash === userHash) {
                return res.status(200).json({
                    message: `Welcome back ${userFinded.username} !`,
                    token: userFinded.token,
                });
            } else if (passwordUser === "") {
                return res.status(400).json({ error: "Password missing" });
            } else {
                return res.status(400).json({ error: "Invalid password" });
            }
        } else {
            return res.status(404).json({ message: "Account not find" });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
module.exports = router;