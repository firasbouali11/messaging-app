import { Button, Grid, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../App';
import image from "../images/login.jpg";
import { ALERT, POST } from '../utils/helpers';

function Login() {

  const {logged_in, setLoggedIn, socket} = useContext(Context)
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(()=>{
    if (logged_in) navigate("/")
  },[logged_in, navigate])

  const loginUser = async () => {
    const user = {
      email, password
    }
    const {code, cookie, data} = await POST("/user/login", user, "json", true)
    if(code === 200){
      document.cookie = cookie
      socket.emit("join",cookie)
      setLoggedIn(true)
    } else ALERT(code, data)
  }

  return (
    <Grid container style={{ height: "100vh", padding: 0, margin: 0, overflow: "hidden" }}>
      <Grid item xs={7} borderColor="red">
        <img src={image} style={{ height: "100vh", width: "100%" }} alt="login" />
      </Grid>
      <Grid item xs={5}>
        <div style={{ display: "flex", margin: "20%", padding: "5%", flexDirection: "column", border: "1px solid black" }}>
          <TextField label="Email" variant="filled" color='primary' value={email} onChange={e => setEmail(e.target.value)}/>
          <br />
          <TextField label="Password" type="password" variant="filled" value={password} onChange={e => setPassword(e.target.value)}/>
          <br />
          <Button variant="outlined" onClick={loginUser}>Login</Button>
          <br />
          <Link to="/signup" style={{width:"100%", textDecoration:"None"}}><Button variant="outlined" fullWidth >Signup</Button></Link>
        </div>
      </Grid>
    </Grid>
  );
}

export default Login;