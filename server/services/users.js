const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("../schemas/User")
const { getUserIdFromCookie } = require("../Utils/utils")

const signUp = async (user_data) => {
    const {username, email, password, image} = user_data
    if(username && email && password){
        const salt = await bcrypt.genSalt(10)
        const hashed_password = await bcrypt.hash(password, salt)
        const user = new User({
            username, email, password: hashed_password, image
        })
        try {
            await user.save()
        }catch(e) {
            console.error(e)
            return false
        }

        return true
    }
    return false
}

const login = async (user_data) => {
    const {email, password} = user_data
    if(email && password) {
        const user_data_from_db = await User.findOne({email})
        if(user_data_from_db == null) return false
        const res = await bcrypt.compare(password, user_data_from_db.password)
        if(res) {
            const token = jwt.sign({
                username: user_data_from_db.username,
                id: user_data_from_db._id
            }, process.env.JWT_TOKEN_KEY)
            const username = user_data_from_db.username
            return {token, username, email}
        }
        return false
    }
    return false
}

const updateUser = async (user_data) => {
    await User.findOneAndUpdate(user_data)
    return "User updated"
}

const becomeFriends = async (user1, user2) => {
    const user1_data = await User.findById(user1)
    const user2_data = await User.findById(user2)
    await User.updateOne({_id: user1}, {
        $set: {
            friends: [...user1_data.friends, user2]
        }
    })
    await User.updateOne({_id: user2}, {
        $set: {
            friends: [...user2_data.friends, user1]
        }
    })
    return `${user1} and ${user2} are friends !`
}

const getFriends = async (cookie) => {
    const user_id = getUserIdFromCookie(cookie)
    const user = await User.findById(user_id)
    const friends = User.find({
        _id: {$in: user.friends}
    }, "-password -friends")
    return friends
}

const getAllUsers = async () => {
    const users = await User.find(null,"-password -created_at -friends")
    const users_map = new Map(users.map(user => {
        return [user.email, user]
    }))
    return Object.fromEntries(users_map)
}

const getUserIdMapping = async () => {
    const users = await User.find(null,"username email")
    const users_map = new Map(users.map(user => {
        return [user.id, user]
    }))
    return Object.fromEntries(users_map)
}

const getCurrentUserData = async (cookie) => {
    const user_id = getUserIdFromCookie(cookie)
    const user = await User.findById(user_id, "-password")
    return user
}

module.exports = {
    login, signUp, updateUser, becomeFriends, getFriends, getAllUsers, getUserIdMapping, getCurrentUserData
}