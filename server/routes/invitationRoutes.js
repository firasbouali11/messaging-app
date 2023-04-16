const { checkToken } = require("../middlewares/security")
const { getInvitations, sendInvitation, handleInvitation, deleteInvitation } = require("../services/invitations")

const router = require("express").Router()

router.use(checkToken)

router.get("/", async (req, resp) => {
    const invitations = await getInvitations(req.headers.cookie)
    resp.json(invitations)
})

router.post("/send/:id", async (req, resp) => {
    const send = await sendInvitation(req.headers.cookie, req.params.id)
    resp.send(send)
})

router.post("/", async (req, resp) => {
    const deal = await handleInvitation(req.headers.cookie, req.body)
    resp.send(deal)
})

router.delete("/", async (req, resp) => {
    const deleted = await deleteInvitation(req.headers.cookie, req.body) 
    resp.send(deleted)
})

module.exports = router