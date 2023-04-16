import { AppBar, Autocomplete, Avatar, Button, Card, CardActionArea, CardActions, CardContent, IconButton, ListItemAvatar, Menu, TextField, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { prefix_host } from "../utils/config";

function NavBar(props) {

    const { users, logOut, searchUser, user_id_mapping, getFriends, current_user } = props

    const [anchorEl, setAnchorEl] = useState(null);
    const [invitations, setInvitations] = useState([])
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const getInvitations = async () => {
        const resp = await fetch(prefix_host + "/invitation", { credentials: "include" })
        const data = await resp.json()
        setInvitations(data)
    }

    const handleInvitation = async (invitation_id, accepted, sender) => {
        const payload = {
            _id: invitation_id,
            sender,
            accepted
        }
        console.log(payload)
        const resp = await fetch(prefix_host + "/invitation", {
            credentials: "include",
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        if (resp.status === 200) {
            await getFriends()
            await getInvitations()
        } else {
            alert(`code: ${resp.status}\nmessage: ${await resp.text()}`)
        }
    }
    useEffect(() => {
        getInvitations()
    }, [])

    return (
        <AppBar position="static" style={{ height: "5%" }}>
            <Toolbar style={{ marginTop: -10, display: "flex", justifyContent: "space-between" }}>
                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                    <ListItemAvatar>
                        {current_user?.image ? <img alt="profile" style={{width:"40px", height:"40px", borderRadius:"50%"}} src={current_user?.image } />: <Avatar/>}
                    </ListItemAvatar>
                    <h2>{`${current_user?.username} (${current_user?.email})`}</h2>
                </div>
                <div style={{ display: "flex" }}>
                    <Autocomplete
                        disablePortal
                        options={Object.keys(users)}
                        size="small"
                        sx={{ width: 300 }}
                        className="search"
                        onChange={e => searchUser(e.target.innerText)}
                        renderInput={(params) => <TextField {...params} placeholder="Search" />}
                    />
                    <div>
                        <IconButton style={{ color: "white" }} onClick={handleClick}>
                            <NotificationsActiveIcon></NotificationsActiveIcon>
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            {invitations.length === 0 ? <p style={{ padding: 30 }}>No Invitations</p> : invitations.map(invitation => (
                                <Card style={{ width: 300, margin: 10, backgroundColor: "rgba(0,0,0,0.1)" }} elevation={1}>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography gutterBottom variant="h6" component="div">
                                                {user_id_mapping[invitation.sender]?.username}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        <Button size="small" color="primary" onClick={_ => handleInvitation(invitation._id, true, invitation.sender)}>
                                            Accept
                                        </Button>
                                        <Button size="small" color="error" onClick={_ => handleInvitation(invitation._id, false, invitation.sender)}>
                                            Decline
                                        </Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </Menu>
                    </div>
                    <Button style={{ color: "white" }} onClick={logOut}>Logout</Button>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;