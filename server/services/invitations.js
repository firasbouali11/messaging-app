const { getUserIdFromCookie } = require("../Utils/utils")
const Invitation = require("../schemas/Invitation")
const { becomeFriends } = require("./users")

const sendInvitation = async (cookie, receiver) => {
    const user_id = getUserIdFromCookie(cookie)
    const invitation_from_sender_to_user = await Invitation.findOne({receiver, sender: user_id})
    if(invitation_from_sender_to_user === null){
        const data = {sender: user_id, receiver, invitation_status: "In Progress"}
        const invitation = new Invitation(data)
        await invitation.save()
        return true
    }
    return false
}

const getInvitations = async (cookie) => {
    const user_id = getUserIdFromCookie(cookie)
    const invitations = await Invitation.find({receiver: user_id, invitation_status: "In Progress"})
    return invitations
}

const handleInvitation = async (cookie, payload) => {
    const user_id = getUserIdFromCookie(cookie)
    const {accepted, _id, sender} = payload
    const invitation_status = accepted ? "Accepted" : "Rejected"
    if(accepted) {
        await Invitation.findByIdAndUpdate(_id, {...payload, invitation_status})
        await becomeFriends(user_id, sender)
    }
    return true
}

const deleteInvitation = async (cookie, payload) => {
    const user_id = getUserIdFromCookie(cookie)
    const {_id, sender} = payload
    if(user_id === sender) {
        await Invitation.findByIdAndDelete(_id)
    }
    return true
}


module.exports = {getInvitations, sendInvitation, handleInvitation, deleteInvitation}