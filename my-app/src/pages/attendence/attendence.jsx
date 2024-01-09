import React from 'react';
import RightSide from "../../components/rightside/rightSide"
import { baseUrl } from '../../core';
import { accessSync } from 'fs';
import { useState, useRef, useEffect, useContext } from "react";
import axios from 'axios';
import './attendece.css'

function Attendence(){

     const [attendences, setAttendences] = useState([])


  useEffect(()=>{
   allAttendence();

  },[])

const allAttendence =async (e)=>{
    
  try{
    const response =await axios.get(`${baseUrl}/api/v1/getAllAttendenceStudent`,{
      withCredentials:true,
    })
    console.log(response.data)
    setAttendences(response.data)
  }
  catch(err) {
    console.log(err)
    alert("Try Again later after some time.....")
  }
}

    return(
        <div className="main-div">
      
            <RightSide />
            


            <div className="left-side">
       
          
       <div className="main-heading additional-main-heading">
       <svg xmlns="http://www.w3.org/2000/svg" width="51" height="51" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16"  style={{marginBottom:"2px" , color:"#5C93FA"}}>
<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
<path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
</svg>

       <h3 className="heading"> Attendence</h3></div>

      <div className="student additional-student">
      <div className="value-name-div additional-value-name-div">
              <ul className="heading-name-value  additional-heading-name-value">
            <li>id</li>
            <li>Name</li>
            <li>Course</li>
            <li>Email</li>
            <li>Check In</li>
            <li>Check Out</li>
          </ul>
        </div>
       
     

          {attendences.map((attendence ) =>(
           <ul className="heading-value-attendence additional-heading-value">
           <li id="serialNumber1">{attendence._id.slice(-10)}</li>
           <li id="studentName1 ">{attendence.firstName} {attendence.lastName}</li>
           <li id="course1">{attendence.course}</li>
           <li id="studentEmail-attendence1">{attendence.email}</li>
           <li id="checkin1">{attendence.checkinTime}</li>
           <li id="checkout-attendence1">{attendence.checkoutTime}</li>
         </ul>
          ))} 

      </div>
 </div>
        </div>
    )
}

export default Attendence