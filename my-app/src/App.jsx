import React, { useEffect, useContext, useState } from "react";


// import logo from './logo.svg';
import "./App.css";
import axios from "axios";
import { Routes, Route, Link, Navigate } from "react-router-dom";


import Login from "./pages/login/login";


import AdminPanel from "./pages/adminPanel/adminPanel";
import Student from "./pages/student/student";
import Attendence from "./pages/attendence/attendence";

import GetIndividualAttendence from "./pages/getIndividualAttendence/getIndividualAttendence";

import { GlobalContext } from "./context/context";
// import { baseUrl } from "../core";
import {baseUrl} from "./core"




function App() {

  //  const [isLogin, setIsLogin]=useState(false)
  const { state, dispatch } = useContext(GlobalContext);

  useEffect(()=>{
     axios.interceptors.request.use(
      function(config){
        config.withCredentials=true;
        return config
      },
      function (error){
        return Promise.reject(error);
      }

     )
  },[])



  useEffect(() => {
  
    const checkUserLoginStatus = async () => {
      console.log('Checking user login status')
      try {
        const response = await axios.get(`${baseUrl}/api/v1/profile`, {
          withCredentials: true,
        });
        // const response = await axios.get(`${baseUrl}/ping`, {
        //   withCredentials: true,
        // });
        // setIsLogin(true);
        dispatch({
          type: "USER_LOGIN",
          payload:response.data.data
        });

        // console.log("where is hhh "+response.data.);
      } catch (error) {
        console.log("error is come in app use effect ",error);
        dispatch({
          type: "USER_LOGOUT",
        });
        // setIsLogin(false);
      }
    };

    checkUserLoginStatus();
  }, []);

const logoutHandler =async ()=>{
  try{
  const response=await axios.post(`${baseUrl}/api/v1/logout`,{},{
      withCredentials:true
    })  

    dispatch({
      type:"USER_LOGOUT"
    })
  }
  catch(err){
    console.log("error in logoutHandler"+err)
  }
    

};

// state.isLogin = true;
  return (
    
    <div>
     

      {/* adimn routes */}
      {state.isLogin === true && state.role === "admin" ? (
        <>
          {/* <nav>
            <ul>
              <li className="admin-home">
                <Link to={"/"}>Admin Home</Link>
              </li>
              <li className="admin-about">
                <Link to={"/about"}>Admin About</Link>
              </li>
              <li className="admin-chat">
                <Link to={"/chat"}>Admin Chat</Link>
              </li>
           <button onClick={logoutHandler}>Admin Logout</button>
            </ul>
          </nav> */}
          <Routes>
            <Route path="/" element={<AdminPanel />} />
            <Route path="attendence" element={<Attendence />} />
            <Route path="student" element={<AdminPanel />} />
            {/* <Route path="about" element={<About />} />
            <Route path="chat" element={<Chat />} /> */}
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </>
      ) : null
      }
{/* user routes */}
 {state.isLogin === true && state.role === "user" ? (
        <>
          <nav className="nav-unauth-route-user1">

          
            {/* <ul className="ul-unauth-route-user">
              <li className="student">
                <Link to={"/"} style={{textDecoration:"none", border:"none"}}><p className="unauth-route-name-user">Student</p></Link>
              </li> */}
              {/* <li className="about">
                <Link to={"/about"} style={{textDecoration:"none"}}><p className="unauth-route-name-user">About</p></Link>
              </li> */}
              {/* <li>
                <Link className="bg-indigo-500 rounded text-white py-1 px-6 m-2" to={`/profile/${state.user._id}`}>Profile</Link>
              </li> */}
              {/* <li className="chat">
                <Link to={"/chat"} style={{textDecoration:"none"}}><p className="unauth-route-name-user">Chat</p></Link>
              </li> */}
              {/* <li className="chatUser">
                <Link to={"/chatUser"} style={{textDecoration:"none"}}><p className="unauth-route-name-user">Users</p></Link>
              </li>
              <button onClick={logoutHandler} className="unauth-logout-button-user">Admin Logout</button> */}
            {/* </ul> */}
          </nav>
          <Routes>
            <Route path="/" element={<Student />} />
            <Route path="student attendence" element={<GetIndividualAttendence />} />
            {/* <Route path="chatUser" element={<ChatUser />} />
            <Route path="chat" element={<Chat />} /> */}
            {/* <Route path="profile/:userId" element={<Profile />} /> */}
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </>
      ) : null
      }

{/* unauth routes */}
      {state.isLogin === false ? (
        <>
          {/* <nav className="nav-unauth-route">
            <ul className="ul-unauth-route">
            <li>
                <Link to={"/frontpost"} style={{textDecoration:"none", border:"none"}}><p className="unauth-route-name">Post</p></Link>
              </li>
              <li>
                <Link to={"/login"} style={{textDecoration:"none", border:"none"}}><p className="unauth-route-name">Login</p></Link>
              </li>
              <li>
                <Link to={"/signup"} style={{textDecoration:"none"}}><p className="unauth-route-name">Signup</p></Link>
              </li>
            </ul>
          </nav> */}
          <Routes>
            <Route path="login" element={<Login />} />
            {/* <Route path="signup" element={<Signup />} />
            <Route path="frontpost" element={<FrontPost />} /> */}
            <Route path="*" element={<Navigate to="/Login" replace={true} />} />
          </Routes>
        </>
      ) : null}

      {/* splash screen */}
       {state.isLogin === null ? (
        <div>
        
        </div>

       ):null}

   </div>
);
      }
export default App
