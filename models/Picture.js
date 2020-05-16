const mongoose = require("mongoose");

const Picture = mongoose.model("Picture", {
    type: String,
    is_active: Boolean,
    infos: Object,
});

module.exports = Picture;