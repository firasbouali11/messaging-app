const uuid = require("uuid")

const {Message, Conversation} = require("../schemas/Message")
const { getUserIdFromCookie } = require("../Utils/utils")

const saveMessage = async (cookie, payload) => {
    const sender = getUserIdFromCookie(cookie)
    if(!payload.conversation_id){
        const conversation_id = uuid.v1()
        const conversation = new Conversation({
            users: sender + payload.receiver,
            conversation_id
        })
        await conversation.save()
        const new_message = new Message({...payload, sender, conversation_id})
        await new_message.save()
        return true
    }
    const new_message = new Message({...payload, sender})
    await new_message.save()
    return true
}

const editMessage = async (payload) => {
    await Message.findByIdAndUpdate(payload._id, payload)
    return true
}

const deleteMessage = async (message_id) => {
    await Message.findByIdAndDelete(message_id)
    return true
}


const getMessages = async (cookie, friend) =>{
    const user_id = getUserIdFromCookie(cookie)
    const first_attempt = await Conversation.findOne({users: user_id + friend})
    const second_attempt = first_attempt == null ?  await Conversation.findOne({users: friend + user_id}) : first_attempt
    return await Message.find({conversation_id: second_attempt?.conversation_id})
}

module.exports = {
    saveMessage, editMessage, deleteMessage, getMessages
}