import { Box, Button, Drawer } from "@mui/material";
import { Fragment } from "react";
import { ALERT, POST } from "../utils/helpers";

function ProfileSlideOut(props) {
    const { searched_user, friends, slideout_open, setSlideoutOpen } = props

    const sendInvitation = async () => {
        const {code, data} = await POST("/invitation/send/" + searched_user._id)
        if (code !== 200) ALERT(code, data)
    } 

    return (
        <Fragment key="right">
            <Drawer
                anchor="right"
                open={slideout_open}
                onClose={_ => setSlideoutOpen(false)}
            >
                <Box
                    sx={{ width: 350 }}
                    role="presentation"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}
                >
                    <img src={searched_user?.image ? searched_user?.image : "https://media.istockphoto.com/id/476085198/photo/businessman-silhouette-as-avatar-or-default-profile-picture.jpg?s=612x612&w=0&k=20&c=GVYAgYvyLb082gop8rg0XC_wNsu0qupfSLtO7q9wu38="}
                        alt="" style={{ width: 300, height: 300, borderRadius: "50%" }} />

                    <h1>{searched_user?.username}</h1>
                    <Button variant="contained" disabled={friends?.map(e => e._id).includes(searched_user?._id)} onClick={sendInvitation}>Send Invitation</Button>
                </Box>
            </Drawer>
        </Fragment >
    );
}

export default ProfileSlideOut;