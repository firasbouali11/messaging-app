const router = require("express").Router()

const { checkToken } = require("../middlewares/security")
const {login, signUp, updateUser, becomeFriends, getFriends, getAllUsers, getUserIdMapping, getCurrentUserData} = require("../services/users")
const { getUserIdFromCookie } = require("../Utils/utils")

router.post("/login", async (req, resp) => {
    const {token, username, email} = await login(req.body)
    if(token) resp.setHeader("Cookie","token=" + token).json({
        email,username
    })
    else resp.status(403).send("Wrong creds !")
})

router.post("/signup", async (req, resp) => {
    const token = await signUp(req.body)
    if(token) resp.send("user created successfully")
    else resp.status(400).send("Something went wrong !")
})

router.put("/",checkToken, async (req, resp) => {
    const update_user = await updateUser(req.body)
    resp.send(update_user)
})

router.get("/befriend/:id", checkToken, async (req, resp) => {
    const new_friend = req.params.id
    const user_id = getUserIdFromCookie(req.headers.cookie)
    const become_friends = await becomeFriends(user_id, new_friend)
    resp.send(become_friends)
})

router.get("/friends", checkToken, async (req, resp) => {
    const cookie = req.headers.cookie
    const friends = await getFriends(cookie)
    resp.send(friends)
})

router.get("/user-email-mapping", async (req, resp) => {
    const users = await getAllUsers()
    resp.json(users)
})

router.get("/user-id-mapping", async (req, resp) => {
    const users = await getUserIdMapping()
    resp.json(users)
})

router.get("/current-user", async (req, resp) => {
    const user = await getCurrentUserData(req.headers.cookie)
    resp.json(user)
})

module.exports = router