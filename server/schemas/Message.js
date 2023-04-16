const {Schema, model} = require("mongoose")


const ConversationSchema = new Schema({
    users : String,
    conversation_id: String
})

const MessageSchema = new Schema({
    sender: String,
    receiver: String,
    conversation_id: String,
    created_at: {type: Date, default: Date.now},
    message: String,
})

const Message = model("Message", MessageSchema)
const Conversation = model("Conversation", ConversationSchema)

module.exports = {Message, Conversation} 