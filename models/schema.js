const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNo:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    position:{
        type: String,
        enum: ["Student", "Teacher"],
        default: "Student"
    },
    token: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model("User", schema);