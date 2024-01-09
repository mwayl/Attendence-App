import React from "react";
import { NavLink } from "react-router-dom";
import { GlobalContext } from "../../context/context";
import axios from "axios";
import { baseUrl } from "../../core";
import { useState, useRef, useEffect, useContext } from "react";
import "./rightSide.css";


  


function RightSide(){
    let { state, dispatch } = useContext(GlobalContext);

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
      
      const studentAttendence =()=>{
      
      }


 return(
    <div className="right-side">
    <h2 className="logo-heading">Logo</h2>
    <ul className="list-right-side">
        <li className="first">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
<path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
</svg>
           <NavLink to="/student" className="link-second">Student</NavLink></li>
        <br />
        <li className="second" onClick={studentAttendence} >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-person-badge" viewBox="0 0 16 16">
<path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
<path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492z"/>
</svg>
         <NavLink to="/attendence" className="link-second">Attendence</NavLink></li>
    </ul>
    <button className="logout" onClick={logoutHandler}>Logout</button>
</div>
 )
}

export default RightSide;