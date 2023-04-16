const {Schema, model} = require("mongoose")


const schema = new Schema({
    email: {type: String, unique: true},
    password: String,
    created_at: {type: Date, default: Date.now},
    username: String,
    image: String,
    friends: {type: [String], default:[] },
})

const User = model("User", schema)

module.exports = User