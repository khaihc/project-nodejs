const mongoose = require("mongoose");

const schemaUser = new mongoose.Schema({
    Username: {
        type: String,
        // require: true,
        min: 6,
        max: 255
    },
    Email: {
        type: String,
        // require: true,
        max: 255,
        min: 6
    },
    Password: {
        type: String,
        // require: true,
        max: 1024,
        min: 6
    },
    Image: {
        type: String,
        // require: true
    },
})

module.exports = mongoose.model("User", schemaUser);