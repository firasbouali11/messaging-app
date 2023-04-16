import { Avatar, Button, List, ListItemAvatar } from "@mui/material";

function FriendsBox(props) {
    const {friends, handleFriendSelect, connected_users}= props 
    return (
        <List style={{ width: "30%", overflowY: "scroll" }}>
            {friends.map(friend => (
                <Button
                    onClick={_ => handleFriendSelect(friend)}
                    variant="outlined"
                    key={friend._id}
                    style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px", margin: 10, width: "90%", backgroundColor: localStorage.getItem("selected_friend") === friend._id ? "rgba(25, 118, 210, 0.8)" : "white" }}>
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                        <ListItemAvatar>
                            <Avatar />
                        </ListItemAvatar>
                        <p style={{ color: localStorage.getItem("selected_friend") !== friend._id ? "rgba(25, 118, 210, 0.8)" : "white" }}>{friend.username}</p>
                    </div>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: connected_users.includes(friend._id) ? "green" : "grey" }}></span>
                </Button>
            ))}
        </List>
    );
}

export default FriendsBox;