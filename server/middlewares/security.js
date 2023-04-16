const jwt = require("jsonwebtoken")

const { extractTokenValue } = require("../Utils/utils")

const checkToken = (req, resp, next) => {
    const token = extractTokenValue(req.headers.cookie)
    try {
        const {username, _id} = jwt.verify(token, process.env.JWT_TOKEN_KEY)
        if(!username && !_id) resp.status(401).send("Unauthorized User")
    } catch(e){
        console.error(e)
        return resp.status(401).send("Unauthorized User")
    } 
    return next()
}  

module.exports = {
    checkToken
}