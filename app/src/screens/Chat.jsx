import { Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import FriendsBox from '../components/FriendsBox';
import MessageBox from '../components/MessageBox';
import NavBar from '../components/NavBar';
import ProfileSlideOut from '../components/ProfileSlideOut';
import { ALERT, GET, POST } from "../utils/helpers";

function Chat() {


    /**
     * Context states
     */
    const { logged_in, setLoggedIn, socket } = useContext(Context)
    const navigate = useNavigate()

    /**
     * Local states
     */
    const [friends, setFriends] = useState([])
    const [users, setUsers] = useState([])
    const [users_mapping, setUsersMapping] = useState([])
    const [slideout_open, setSlideoutOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [searched_user, setSearchedUser] = useState(null)
    const [connected_users, setConnectedUsers] = useState([])
    const [current_user, setCurrentUser] = useState(null)

    /**
     * References
     */
    const messageInput = useRef(null)

    /**
     * Helper functions 
     */
    const logOut = () => {
        socket.emit("leave", "")
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("selected_friend")
        setLoggedIn(false)
    }

    const getFriends = async () => {
        const {code, data} = await GET("/user/friends")
        if(code === 200) setFriends(data)
        if (data.length !== 0) {
            const selected = data[0]._id
            localStorage.setItem("selected_friend", selected)
            await getMessages(selected)
        }
    }

    const getUsers = async () => {
        const user_email_mapping = await GET("/user/user-email-mapping")
        setUsers(user_email_mapping.data)

        const user_id_mapping = await GET("/user/user-id-mapping")
        setUsersMapping(user_id_mapping.data)

        const current_user = await GET("/user/current-user")
        await setCurrentUser(current_user.data)
    }

    const getMessages = async (friend) => {
        const {data} = await GET("/message/" + friend)
        setMessages(data)
    }

    const searchUser = (email) => {
        if (email) {
            setSearchedUser(users[email])
            setSlideoutOpen(!slideout_open)
        }
    }

    const sendMessage = async () => {
        const selected_friend = localStorage.getItem("selected_friend")
        const message = messageInput.current.firstChild.firstChild.value
        messageInput.current.firstChild.firstChild.value = ""
        const payload = messages.length === 0 ? { receiver: selected_friend, message } : { conversation_id: messages[0].conversation_id, receiver: selected_friend, message }
        const {code, data} = await POST("/message", payload, "text")
        if (code === 200) {
            await getMessages(selected_friend)
            socket.emit("send_message", { ...payload, cookie: document.cookie })
        } else {
            ALERT(code, data)
        }
    }

    const handleFriendSelect = async (friend) => {
        localStorage.setItem("selected_friend", friend._id)
        await getMessages(friend._id);
    }

    async function init() {
        if(logged_in){
            await getFriends()
            await getUsers()
        }
    }

    /**
     * Effects
     */
    useEffect(() => {
        socket.emit("join", document.cookie)
        socket.on("receive_message", async (msg) => {
            const selected_friend = localStorage.getItem("selected_friend")
            console.log(selected_friend, msg.sender)
            if (selected_friend === msg.sender) {
                await getMessages(msg.sender)
            }
        })
        socket.on("connected", (users) => {
            setConnectedUsers(users)
        })
        init()
    }, [])

    useEffect(() => {
        if (!logged_in) navigate("/login")
    }, [logged_in, navigate])

    return (
        <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
            <NavBar users={users} searchUser={searchUser} logOut={logOut} user_id_mapping={users_mapping} getFriends={getFriends} current_user={current_user} />
            <div style={{ display: "flex", height: "95%" }}>
                <FriendsBox
                    friends={friends}
                    connected_users={connected_users}
                    handleFriendSelect={handleFriendSelect} 
                />
                <div style={{ display: "flex", flexDirection: "column", margin: "0 20px", width: "70%" }}>
                    <h1 style={{ height: "5%" }}>{users_mapping[localStorage.getItem("selected_friend")]?.username}</h1>
                    <MessageBox messages={messages} users_mapping={users_mapping} />
                    <ProfileSlideOut
                        friends={friends}
                        searched_user={searched_user}
                        slideout_open={slideout_open}
                        setSlideoutOpen={setSlideoutOpen}
                    />
                    <div style={{ display: "flex" }}>
                        <TextField fullWidth style={{ marginRight: 20 }} ref={messageInput} onKeyDown={e => e.key === "Enter" ? sendMessage() : ""} />
                        <Button variant="contained" onClick={sendMessage} >Send</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;