import { createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { io } from "socket.io-client";
import Chat from "./screens/Chat";
import Login from "./screens/Login";
import Signup from "./screens/Signup";

export const Context = createContext(null)

function App() {

  let socket = io("localhost:2020");

  const [logged_in, setLoggedIn] = useState(document.cookie.includes("token="))

  const data = {
    logged_in, setLoggedIn, socket
  }

  return (
    <Context.Provider value={data}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/signup" element={<Signup/>} />
          <Route path="/" element={<Chat/>} />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
