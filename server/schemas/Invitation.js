const { Schema, model } = require("mongoose")

const InvitationSchema = new Schema({
    sender: String,
    receiver: String,
    created_at: {type: Date, default: Date.now},
    invitation_status: String,
})

const Invitation = model("Invitation", InvitationSchema)

module.exports = Invitation 