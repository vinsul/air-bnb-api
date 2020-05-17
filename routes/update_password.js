const express = require("express");
const User = require("../models/User");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const mailgun = require("mailgun-js");

const router = express.Router();
const is_authenticated = require("../middleware/is_authenticated");

router.post("/update_password", is_authenticated, async(req, res) => {
    try {
        const user_finded = await User.findOne({ email: req.fields.email });
        if (user_finded) {
            const new_password = req.fields.password;
            const verification = req.fields.verification;

            const new_hash = SHA256(new_password + user_finded.salt).toString(
                encBase64
            );
            const verification_hash = SHA256(
                verification + user_finded.salt
            ).toString(encBase64);

            if (new_hash === verification_hash) {
                user_finded.hash = new_hash;

                await user_finded.save();

                const mg = mailgun({
                    apiKey: process.env.MAILGUN_API_KEY,
                    domain: process.env.MAILGUN_DOMAIN,
                });

                const data = {
                    from: "Airbnb API <postmaster@" + process.env.MAILGUN_DOMAIN + ">",
                    to: user_finded.email,
                    subject: "Change your password",
                    text: `Your password has changed`,
                };

                mg.messages().send(data, function(error, body) {
                    if (body.id) {
                        console.log(body);
                        return res.status(200).json({
                            message: "Password as changed",
                            email_status: `Ok :  ${body.message}`,
                        });
                    } else {
                        return res.status(200).json({
                            password_status: "Password changed",
                            email_status: `Fail : ${body.message}`,
                        });
                    }
                });
            } else {
                return res
                    .status(400)
                    .json({ error: "Password or Verification not matching" });
            }
        } else {
            return res.status(400).json({ message: "Account not find" });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;