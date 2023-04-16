import { Button, Grid, TextField } from "@mui/material";
import image from "../images/login.jpg"
import { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { Link, useNavigate } from "react-router-dom";
import { ALERT, POST } from "../utils/helpers";
function Signup() {

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmed_password, setConfirmedPassword] = useState("")
  const [photo, setPhoto] = useState("")

  const {logged_in} = useContext(Context)
  const navigate = useNavigate()

  useEffect(()=>{
    if (logged_in) navigate("/")
  },[logged_in, navigate])


  const uploadImage = (images) => {
    const [image_file] = images
    console.log(image_file)
    const file_reader = new FileReader()
    file_reader.onload = () =>{
      const src = file_reader.result
      console.log(src)
      setPhoto(src)
    }
    file_reader.readAsDataURL(image_file)
  }

  const createUser = async () => {
    if(password === confirmed_password){
      const user = {
        email, username, password, image: photo
      }
      const {code, data} = await POST("/user/signup", user, "text")
      if(code === 200) navigate("/login")
      else ALERT(code, data)
    }
  }
  return (
    <Grid container style={{ height: "100vh", padding: 0, margin: 0, overflow: "hidden" }}>
      <Grid item xs={7} borderColor="red">
        <img src={image} style={{ height: "100vh", width: "100%" }} alt="login" />
      </Grid>
      <Grid item xs={5}>
        <div style={{ display: "flex", margin: "20%", padding: "5%", flexDirection: "column", border: "1px solid black" }}>
          <TextField label="Username*" variant="filled" color='primary' value={username} onChange={e => setUsername(e.target.value)} />
          <br />
          <TextField label="Email*" variant="filled" color='primary' value={email} onChange={e => setEmail(e.target.value)} />
          <br />
          <TextField label="Password*" type="password" variant="filled" value={password} onChange={e => setPassword(e.target.value)} />
          <br />
          <TextField label="Confirm password*" variant="filled" color='primary' value={confirmed_password} onChange={e => setConfirmedPassword(e.target.value)} />
          <br />
          <p style={{ color: "#1976d2", marginTop: 0, paddingTop: 0 }}>Select profile image</p>
          <TextField type="file" onChange={e => uploadImage(e.target.files)}/>
          <br />
          <Button variant="outlined" onClick={createUser}>Signup</Button>
          <br />
          <Link to="/login" style={{width:"100%", textDecoration:"None"}}><Button variant="outlined" fullWidth >Login</Button></Link>
        </div>
      </Grid>
    </Grid>
  );
}

export default Signup;