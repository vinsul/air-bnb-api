const User = require("./../models/User");

const isAuthenticated = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const user = await User.findOne(
                {token: req.headers.authorization.replace("Bearer ", "")});
            if (user){
                req.user = user;
                return next();
            }
            else {
                res.status(401).json({message: "Unauthorized"});
            }
        }
        else {
            res.status(401).json({message: "Unauthorized"});
        }
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

module.exports = isAuthenticated;