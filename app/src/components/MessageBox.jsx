import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { useEffect } from "react";

function MessageBox(props) {
    const {messages, users_mapping} = props

    useEffect(() => {
        document.getElementById("aa").scrollTop = document.getElementById("aa").scrollHeight
    }, [messages])

    return ( 
        <div style={{ border: "1px solid black", height: "80%", margin: "0 0 10px 0", overflowY: "scroll" }} id="aa" >
        <List>
            {messages.map(message => (
                <ListItem key={message._id}>
                    <ListItemAvatar>
                        <Avatar>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={users_mapping[message.sender]?.username} secondary={message.message} />
                </ListItem>
            ))}
        </List>
    </div>
     );
}

export default MessageBox;