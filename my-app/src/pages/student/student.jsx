import React from "react";
// import img1 from "./../../assets/img1.jpg"
// import img2 from "./../../assets/img2.jpeg"
import { useParams } from "react-router-dom"
import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { baseUrl } from "../../core";
import { GlobalContext } from "../../context/context";
import { NavLink } from "react-router-dom";

import profilePic from "../../assests/random profile.jpg";

import './student.css'





  

function Student(){
    const { state, dispatch } = useContext(GlobalContext);
    const [profile, setProfile]=useState('');
    const [checkinForm, addCheckinForm]=useState(false);
    const [selectedImage, setSelectedImage]=useState("");
    const [profileImagefileURL, setprofileImageFileURL] =useState(null)
    const [profileImagefile, setprofileImageFile]=useState(null)
    const videoRef = useRef();
    const canvasRef = useRef();
    const [takeImage, setTakeImage] =useState(false);
    const [showResultOfAttendence, setShowResultOfAttendence] = useState("");
    const [checkInButton, setCheckInButton] = useState(true)
    const[showCheckoutTimeDiv, setShowCheckoutTimeDiv] = useState(false)
    const [remainCheckoutTime, setRemainCheckoutTime] = useState() 
    const [checkinTime, setCheckinTime] = useState()

// ----------------------get our live location from browser ---------------------------

const handleLocationSuccess = (position) => {
  const userLocation = {
   
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  // Call a function to check if the user is within the specified radius
  checkLocationRadius(userLocation);
};

// ----------------------Callback function for location retrieval error---------------
const handleLocationError = (error) => {
  console.error('Error getting user location:', error.message);
};

// ----------------------check location is in required area or not ----------

const TargetLocation = {
 
  latitude: 24.897842,
  longitude: 67.188455,
};




const checkLocationRadius = (userLocation) => {
  const distance = calculateHaversineDistance(userLocation, TargetLocation);

  if (distance <= 300) {
    // User is within the radius, proceed to capture photo and send to the database
    // console.log('inside')
    capturePhoto()
    setTimeout(()=>{
      addCheckinForm(false);
    },20000)
    
  } else {
    // User is outside the radius, show a message or take appropriate action
    alert('You are outside the specified area.');
  }
};

function calculateHaversineDistance(point1, point2) {
  const R = 300; // Radius of the Earth in meters
  const toRadians = (angle) => angle * (Math.PI / 180);

  const lat1 = toRadians(point1.latitude);
  const lon1 = toRadians(point1.longitude);
  const lat2 = toRadians(point2.latitude);
  const lon2 = toRadians(point2.longitude);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters

  return distance;
}

// ----------------------check in our computer location live is enable or not ---------------------------


    const getUserLocation = (e) => {
      e.preventDefault();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);
        console.log('location success')
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    useEffect(() => {
        getProfile();
        getAttendence()
        
        // popup close code 
          if (showCheckoutTimeDiv) {
           var timeoutId = setTimeout(() => {
              setShowCheckoutTimeDiv(false);
            }, 26000)};
        
            // Clear the timeout when the component unmounts or when showCheckoutTimeDiv becomes false
            return () => clearTimeout(timeoutId);
        
      }, [showCheckoutTimeDiv]);

      const getProfile = async () => {
        try {
          const response = await axios.get(`${baseUrl}/api/v1/studentProfile/${state.user.email}`, {
            withCredentials: true,
          });
          setProfile(response.data)
          console.log("specific user"+response.data.firstName); // Assuming the data is in the 'data' property of the response
        } catch (err) {
          console.log(err);
        }
      };

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
      }




const openCamera = async (e) => {
  e.preventDefault();

 setTakeImage(true)
 try {
   const stream = await navigator.mediaDevices.getUserMedia({ video: true });
   videoRef.current.srcObject = stream;


} 
catch (error) {
   console.error('Error accessing camera:', error);
 }

 setTakeImage(true)
};


const capturePhoto = async () => {


 const video = videoRef.current;
 const canvas = canvasRef.current;
 const context = canvas.getContext('2d');

 // Set the canvas size to match the video frame size
 canvas.width = video.videoWidth;
 canvas.height = video.videoHeight;

 // Draw video frame onto the canvas
 context.drawImage(video, 0, 0, canvas.width, canvas.height);

 let imageData = canvas.toDataURL();
  
  // setSelectedImage(imageData);
  setTakeImage(false);
  setSelectedImage(imageData);

 canvas.toBlob(async (blob) => {
 
  if (blob) {
    const formData = new FormData();
    formData.append('URL', blob, 'filename.png'); // 'image' should match the field name in your backend

    try {
      const response = await axios.post(`${baseUrl}/api/v1/attendence`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

     setShowResultOfAttendence("your attendence is marked")
     setCheckInButton(false)
      console.log(response);
    } catch (error) {
      console.error('Error uploading image:', error);
      setShowResultOfAttendence("your attendence is not marked")
    }
  }
}, 'image/png');

};

//-----------------------see attendence is marked or not when page is refreshed----------------------

const getAttendence =async ()=>{
    //  e.preventDefault();
     try{
      console.log("hello")
    const res =await axios.get(`${baseUrl}/api/v1/getRecentAttendence/${state.user.email}`, {
      withCredentials: true,
    })
    console.log("student"+res.data.checkoutTime)
     let remainTime = res.data.checkoutTime - new Date().getTime()
     remainTime = remainTime/ 3600000
     var parts = remainTime.toString().split('.');

    // Parse the integer part
    var integerPart = parseInt(parts[0]);

    // Parse the decimal part
    var decimalPart = parseFloat('0.'+ (parts[1] || 0));
    decimalPart =Math.ceil(decimalPart * 60)
    
   remainTime =integerPart +" hours and " + decimalPart+" minutes"


    setRemainCheckoutTime(remainTime);
//get check in time
   var checkinTime = 24-integerPart
   
    setCheckinTime(checkinTime)
    
    if(typeof(res.data.email) === 'undefined'){
      
      setCheckInButton(true)
    }
    else{
      setCheckInButton(false)
    }
     }
     catch(err){
            console.log(err)
     }
}

   return(
    <div>
        
          <div>
            <div className="profileInformation">
              <h2 className="studentName">Hello {profile.firstName} {profile.lastName} </h2>
        <img src={profile.url} style={{width:"64px",height:"64px",borderRadius:"55px",marginRight:"60px",opacity:'1',boxShadow:"1px 1px 2px #1d2a42"}}/>
        </div>

        <div className="otherProfileInformation">
        <div><span className="information-heading">Id</span><br/>{profile._id}</div>
        <div><span className="information-heading">Email</span><br/>{profile.email}</div>
        <div><span className="information-heading">Check-in Time</span><br/>{checkinTime} hours</div>
        <div><span className="information-heading">Check-out Time</span><br/>{remainCheckoutTime}</div>
        <NavLink to="/student attendence" className="link-second"><button>Check Attendence</button></NavLink>

        </div>
      </div>

      <div className="lower-information">

{checkInButton === true ? <button className="check-in" onClick={()=>{
            addCheckinForm(true)
        }}>Check In</button> 
        : <button className="check-in" onClick={()=>{
            setShowCheckoutTimeDiv(true)
           
      }}>Check Out</button> 
        
        }
      
        <button className="logOut" onClick={logoutHandler}>Log out</button>

       {showCheckoutTimeDiv && (
        <div className="mainCheckOutDiv">
          <p className="popupContent">Your attendance has been marked, it take place after {remainCheckoutTime} hours later. </p>
          <button onClick={()=>{setShowCheckoutTimeDiv(false)}} className="popupCLoseButton">Close</button>
        </div>
       )}
       </div>
       {/* {showCheckoutTimeDiv && setTimeout(()=>{setShowCheckoutTimeDiv(false)},26000)} */}

        {checkinForm && (
             <div className="overlay">
             <div className="addStudentDiv1" >
          
               
               <form className="Form-div-attendence"  >
               <div className="add-backbutton">
                   <label style={{color:"red"}} onClick={()=>{
                   addCheckinForm(false)
                       // alert("hello")
                   }}>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
 <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
</svg>
</label>
                   {/* <span className="heading-student">add Attedence</span> */}
                   
                    
                 </div>


                 <div className="profile-pic">
                  {/* {takeImage === true ? <video ref={videoRef} width="640" height="380" autoPlay playsInline muted />
                :  
                     
            <label
            for="select_image"
            id="select_imag"
            style={{ color: "black" }}
            onClick={openCamera}
          >
           <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi-bi-camera-fill1" viewBox="0 0 16 16" style={{color:"#1b1d21"}}>
<path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
<path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"/>
</svg>
          </label>

{selectedImage === "" ? (
  <img
    src={profilePic}
    id="dynamicPic1"
    style={{ width: "40vh", height: "40vh", borderRadius: "160px" }}
  ></img>
) : (
  <img
    src={profilePic}
    id="dynamicPic1"
    style={{
      width: "40vh",
      height: "40vh",
      borderRadius: "110px",
      display: "none",
    }}
  ></img>
)}

{selectedImage && (
  <img
    src={selectedImage}
    alt="not found"
    id="dynamicPic1"
    style={{ width: "40vh", borderRadius: "110px", height: "40vh" }}
  ></img>
)}


                } */}






{takeImage === true ? (
  <div className="video-div">
  <video ref={videoRef} width="420" height="480" autoPlay playsInline muted  className="video"/>
  <button onClick={getUserLocation} className="capture-picture">Capture</button>
 
 
  </div>
) : (

  <label
    htmlFor="select_image"
    id="select_image"
    style={{ color: "black" }}
    onClick={openCamera}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="35"
      fill="currentColor"
      className={`bi-bi-camera-fill1 ${selectedImage ? 'hidden' : ''}`} // Fixed class attribute
      viewBox="0 0 16 16"
      style={{ color: "#1b1d21" }}
    >
      <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
      <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" />
    </svg>
  </label>



  
)}



{selectedImage === "" ? (
  <div>
  <img
    src={profilePic}
    id="dynamicPic1"
    style={{
      width: "40vh",
      height: "40vh",
      borderRadius: "160px",
      display: takeImage ? "none" : "block",
      // display:"block"
    }}
  ></img>
  
  </div>
) : (
  <div>
  <img
    src={profilePic}
    id="dynamicPic1"
    style={{
      width: "40vh",
      height: "40vh",
      borderRadius: "160px",
      // display: takeImage ? "none" : "block",
      display:"none"
    }}
  ></img>
  
  </div>
)}

{selectedImage && (
  <div>
  <img
    src={selectedImage}
    alt="not found"
    id="dynamicPic1"
    style={{ width: "40vh", borderRadius: "160px", height: "40vh" }}
  ></img>
 
    </div>
)}

<canvas ref={canvasRef} style={{ display: 'none' }} />

{showResultOfAttendence &&
  <div className="result">{showResultOfAttendence}</div>
}

{/* <img
    src={profilePic}
    id="dynamicPic1"
    style={{
      width: "40vh",
      height: "40vh",
      borderRadius: "160px",
      display:"none",
    }}
  ></img> */}











{/*                  
            <label
              for="select_image"
              id="select_imag"
              style={{ color: "black" }}
              onClick={openCamera}
            >
             <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi-bi-camera-fill1" viewBox="0 0 16 16" style={{color:"#1b1d21"}}>
  <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
  <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"/>
</svg>
            </label> */}
            {/* ( if(getImage === "" && selectedImage !== "" || selectedImage === "" && getImage === ""){
                  <img src={profilePic} id="dynamicPic" style={{width: '30vh' ,height: '31vh'}}></img>
                 }

                 ) */}

            {/* 
                  { getImage === "" && selectedImage !== "" ?
                   <img src={profilePic} id="dynamicPic" style={{width: '30vh' ,height: '31vh',display:'none'}}></img>
                   :<img src={profilePic} id="dynamicPic" style={{width: '30vh' ,height: '31vh'}}></img>}  
                 
                 {getImage && 
                   (<img src={getImage} alt="not found" id="dynamicPic" style={{width: '30vh' ,height: '31vh'}}></img>)
                 
                   } */}

            {/* {selectedImage === "" ? (
              <img
                src={profilePic}
                id="dynamicPic1"
                style={{ width: "40vh", height: "40vh", borderRadius: "160px" }}
              ></img>
            ) : (
              <img
                src={profilePic}
                id="dynamicPic1"
                style={{
                  width: "40vh",
                  height: "40vh",
                  borderRadius: "110px",
                  display: "none",
                }}
              ></img>
            )}

            {selectedImage && (
              <img
                src={selectedImage}
                alt="not found"
                id="dynamicPic1"
                style={{ width: "40vh", borderRadius: "110px", height: "40vh" }}
              ></img>
            )} */}

            {/* <input
              type="file"
              id="select_image"
              name="image"
              style={{ display: "none" }}
              accept="image/*"
             
              onChange={(event) => {
                console.log("image is : " + event.target.files[0].name);
               
                // setSelectedImage=URL.createObjectURL(event.target.files[0]);
                const base64URL = URL.createObjectURL(event.target.files[0]);
                 setSelectedImage(base64URL)
                setprofileImageFileURL(base64URL)

                setprofileImageFile(event.target.files[0])
                
                // sendProfilePicture(
                //   base64URL,
                //   state.user.email,
                //   event.target.files[0]
                // );
              }}

            /> */}

            </div>


    






                 {/* <p class="sign-in">Already have an account? <b><a href="index.html">Sign Up</a></b></p>  */}
               </form>
             </div>
           </div>
        )
            
        }
    </div>
   )
}

export default Student;