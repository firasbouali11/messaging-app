const router = require("express").Router()

const { checkToken } = require("../middlewares/security")
const { getMessages, deleteMessage, editMessage, saveMessage } = require("../services/messages")

router.use(checkToken)

router.get("/:id", async (req, resp) => {
    const friend = req.params.id
    const messages = await getMessages(req.headers.cookie, friend)
    resp.json(messages)
})

router.delete("/:id", async (req, resp)=>{
    const message_id = req.params.id
    const deleted = await deleteMessage(message_id)
    resp.send(deleted)
})

router.put("/", async (req,resp) => {
    const updated = await editMessage(req.body)
    resp.send(updated)
})

router.post("/", async (req, resp) => {
    const cookie = req.headers.cookie
    const save_message = await saveMessage(cookie, req.body)
    resp.send(save_message)
})

module.exports = router