import React from "react";
import { useState, useRef, useEffect, useContext } from "react";
import './getIndividualAttendence.css'
import { baseUrl } from "../../core";
import axios from "axios";
import { GlobalContext } from "../../context/context";



function GetIndividualAttendence(){
    const { state, dispatch } = useContext(GlobalContext);
    const [allIndividualAttendece, setAllIndividualAttendence] =useState([])


    useEffect(()=>{
        getAllStudent()

       
    },[])

    const getAllStudent =async (e) => {
      console.log(state.user.email);
        try{
         const response = await axios.get(`${baseUrl}/api/v1/getAllAttendence/${state.user.email}`,{
        withCredentials: true
         })
         console.log(response.data)
         setAllIndividualAttendence(response.data)
        }
        catch(err){
            console.log(err.data)
            alert(err.data)
        }
    }
   
   
    return(
 

        

        <div className="main">
           <div className="main-heading additional-styling-main-heading" >
           <svg xmlns="http://www.w3.org/2000/svg" width="51" height="51" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16"  style={{marginBottom:"2px" , color:"#5C93FA"}}>
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
</svg>
           <h3 className="heading "> Attendence</h3></div>

            {/* <div className="student additional-styling-student"> */}
            <div className="value-name-div additional-styling-value-name-div">
              <ul className="heading-name-value additional-styling-heading-name-value">
              <li class="id">id</li>
              <li class="name1">Name</li>
              <li class="course-name1">Course Name</li>
              <li class="email1">Email</li>
              <li class="check-in">Check In</li>
              <li class="check-out">Check Out</li>
              </ul>
            </div>


           {allIndividualAttendece.map((attendence)=>(
            <div className="value-div additional-styling-value-div">
            <ul className="heading-value-attendence additional-heading-value1">
                <li id="serialNumber">{attendence._id.slice(-10)}</li>
                <li id="studentName ">{attendence.firstName} {attendence.lastName}</li>
                <li id="course">{attendence.course}</li>
                <li id="studentEmail2">{attendence.email}</li>
                <li id="checkin">{attendence.checkinTime}</li>
                <li id="checkout">{attendence.checkoutTime}</li>
              </ul>

            </div>
           ))}
         
{/* 
              {users.map((user ) =>(
               <Information id={user.id} url={user.url} firstName={user.firstName} lastName={user.lastName} 
               course={user.course} email={user.email} /> */}
              
          
              {/* ))}  */}

          </div>
        // </div>
    )
}

export default GetIndividualAttendence;