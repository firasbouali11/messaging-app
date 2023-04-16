const jwt = require("jsonwebtoken")

const extractTokenValue = (cookie) => {
    try{
        const token = cookie.split(";").filter(e => e.includes("token="))[0].split("=")[1]
        return token
    } catch(e) {
        console.trace(e)
        return false
    }
}

const getUserIdFromCookie = (cookie) => {
    const token = extractTokenValue(cookie)
    if(token){
        const {id} = jwt.verify(token, process.env.JWT_TOKEN_KEY)
        return id
    }
    return token
}

module.exports = {
    extractTokenValue, getUserIdFromCookie
}