const express = require("express");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

const router = express.Router();

router.post("/log_in", async(req, res) => {
    try {
        const user_finded = await User.findOne({ email: req.fields.email });

        if (!user_finded) {
            return res.status(400).json({ message: "Account not find" });
        }
        if (user_finded) {
            const password_user = req.fields.password;
            const user_hash = SHA256(password_user + user_finded.salt).toString(
                encBase64
            );
            if (user_finded.hash === user_hash) {
                return res.status(200).json({
                    message: `Welcome back ${user_finded.username} !`,
                    token: user_finded.token,
                });
            } else if (password_user === "") {
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