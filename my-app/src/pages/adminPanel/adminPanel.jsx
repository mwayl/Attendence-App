import React from "react";
// import img1 from "./../../assets/img1.jpg"
// import img2 from "./../../assets/img2.jpeg"
// import { useParams } from "react-router-dom"
import { useState, useRef, useEffect, useContext } from "react";
import { GlobalContext } from "../../context/context";
import profilePic from "../../assests/random profile.jpg";
import axios from "axios";
import { baseUrl } from "../../core";
import RightSide from "../../components/rightside/rightSide"
import Information from "../../components/information/information";



import './adminPanel.css'


function Chat(){
    let { state, dispatch } = useContext(GlobalContext);
    const[studentForm , addStudentForm]=useState(false)
    const [selectedImage, setSelectedImage] = useState("");
    const [users,setUser] = useState([])
    const firstNameInputRef = useRef(null);
    const lastNameInputRef = useRef(null);
    const courseNameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const numberInputRef = useRef(null);
    const [profileImagefileURL, setprofileImageFileURL] =useState(null)
    const [profileImagefile, setprofileImageFile]=useState(null)
    const [studentEditForm, addStudentEditForm] = useState(false)
    
    // const [showPasswordDiv, dontShowPasswordDiv] = useState("hidden");
    // const [showServerMessageDiv, dontShowServerMessageDiv] = useState("hidden");
    // const [messageFromServer, setMessageFromServer] = useState("");
    useEffect(() => {
      getStudents()
  
      return () => {};
    }, []);

const addStudent =async (e)=>{
    e.preventDefault();
    setSelectedImage(profileImagefileURL)
   addStudentForm(true)
//    alert(firstNameInputRef.current.value +" " +lastNameInputRef.current.value +" " + courseNameInputRef.current.value +" " + emailInputRef.current.value  +" " + passwordInputRef.current.value +" " + numberInputRef.current.value)
//    alert(profileImagefileURL)
//    alert(profileImagefile)

   try {
    const formData = new FormData();
    formData.append("URL", profileImagefileURL);
    formData.append("firstName", firstNameInputRef.current.value);
    formData.append("lastName", lastNameInputRef.current.value);
    formData.append("course", courseNameInputRef.current.value);
    formData.append("email", emailInputRef.current.value);
    formData.append("password", passwordInputRef.current.value);
    formData.append('number', numberInputRef.current.value);

    formData.append("pictureData", profileImagefile);

    const response = await axios.post(`${baseUrl}/api/v1/addStudent`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(response);
    addStudentForm(false);
    alert('Student added successfully');
    getStudents()
    // getCoverPhoto();
  } catch (err) {
    console.log(err);
  }




    }

// const sendProfilePicture=()=>{
//     alert("hello")
// }

const getStudents=async ()=>{
  try {
    // isLoading(true);
    const response = await axios.get(`${baseUrl}/api/v1/students`, {
      withCredentials: true,
    });

    // isLoading(false);
    console.log(response.data);
    // getProfilePicture();
    setUser(response.data);
   
    //   console.log(allPosts)
  } catch (error) {
    console.log(error.data);
    // isLoading(false);
  }
}

const addEditStudent=async (e)=>{
  e.preventDefault();
  const id= e.target.elements[1].value;
  const firstName = e.target.elements[2].value;
  const lastName = e.target.elements[3].value;
  const course = e.target.elements[4].value;
  var password = e.target.elements[5].value;
  const email = e.target.elements[6].value;

  console.log("id is " + id + ", firstName is " + firstName + ", lastName is " + lastName + ", course is " + course + ", password is " + password + ", email is " + email);
  try {
    const response = await axios.put(
      `${baseUrl}/api/v1/studentUpdate/${id}`,
      {
        firstName: firstName,
        lastName: lastName,
        course: course,
        email: email,
      },
      {
        withCredentials: true,
      }
    );
    console.log("for"+response.data.message);
    alert(response.data.message)
    addStudentEditForm(false)
    getStudents()
  } catch (err) {
    console.error(err.message);
  }



}
// const logoutHandler =async ()=>{
//   try{
//   const response=await axios.post(`${baseUrl}/api/v1/logout`,{},{
//       withCredentials:true
//     })  

//     dispatch({
//       type:"USER_LOGOUT"
//     })
//   }
//   catch(err){
//     console.log("error in logoutHandler"+err)
//   }
    

// };

// const studentAttendence =()=>{

// }












    // console.log("state: ", state);
    return (
<div className="main-div">
   <RightSide />
   
    <div className="left-side">
       
          
           <div className="main-heading">
           <svg xmlns="http://www.w3.org/2000/svg" width="51" height="51" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16"  style={{marginBottom:"2px" , color:"#5C93FA"}}>
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
</svg>
           <h3 className="heading"> Students</h3></div>
    
     <button className="add-student-button" onClick={()=>{
        addStudentForm(true)
     }}>Add Student</button>

     {studentForm && (
            <div className="overlay">
              <div className="addStudentDiv" >
           
                
                <form className="Form-div-addstudent" onSubmit={addStudent} >
                <div className="add-backbutton">
                    <label style={{color:"red"}} onClick={()=>{
                    addStudentForm(false)
                        // alert("hello")
                    }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="26" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16" style={{marginLeft:"0px",marginTop:"9px" ,position:"absolute",fontWeight:"600px",cursor:"pointer"}}>
  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
</svg>
</label>
                    <span className="heading-student">Add Student</span>
                    <button type="submit" className="add">Add</button>
                     
                  </div>

                  <div className="profile-pic">
            <label
              for="select_image"
              id="select_imag"
              style={{ color: "black" }}
            >
             <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-camera-fill" viewBox="0 0 16 16" style={{marginLeft:"55px"}}>
  <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
  <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"/>
</svg>
            </label>
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

            {selectedImage === "" ? (
              <img
                src={profilePic}
                id="dynamicPic"
                style={{ width: "20vh", height: "20vh", borderRadius: "110px" }}
              ></img>
            ) : (
              <img
                src={profilePic}
                id="dynamicPic"
                style={{
                  width: "20vh",
                  height: "20vh",
                  borderRadius: "110px",
                  display: "none",
                }}
              ></img>
            )}

            {selectedImage && (
              <img
                src={selectedImage}
                alt="not found"
                id="dynamicPic"
                style={{ width: "20vh", borderRadius: "110px", height: "20vh" }}
              ></img>
            )}

            <input
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

            />

            </div>






                 <div className="input-fields">
                  <label for="firstName">First Name
                  <br />
                  <input
                    type="text"                    // autoComplete="current-password"
                    className="firstName"
                    name="firstName"
                    placeholder="First Name"
                    ref={firstNameInputRef}
                  ></input>
                  </label>
             
                  <label for="lastName">Last Name
                  <br />
                  <input
                    type="text"
                    // autoComplete="current-password"
                    className="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    ref={lastNameInputRef}
                  ></input>
                  </label>
                  <br />
                  <label for="course">Course
                  <br />
                  <input
                    type="text"
                    // autoComplete="current-password"
                    className="course"
                    name="course"
                    placeholder="Course"
                    ref={courseNameInputRef}
                  ></input>
                  </label>
                  <label for="password">Password    
                  <br />
                  <input
                    type="password"
                    // autoComplete="current-password"
                    className="passwordField"
                    name="password"
                    placeholder="Password"
                    ref={passwordInputRef}
                  ></input>
                  </label>
                  <br />
                  <label for="email">Email
                  <br />
                  <input
                    type="email"
                    // autoComplete="current-password"
                    className="emailField"
                    name="email"
                    placeholder="Email"
                    ref={emailInputRef}
                  ></input>
                 </label>
                  <label for="phoneNumber">Phone Number
                  <br />
                  <input
                    type="number"
                    // autoComplete="current-password"
                    className="phoneNumber"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    ref={numberInputRef}
                  ></input>
                  </label>
                  <br />
                  </div>
                  {/* <p class="sign-in">Already have an account? <b><a href="index.html">Sign Up</a></b></p>  */}
                </form>
              </div>
            </div>

          )}

          <div className="student">
            <div className="value-name-div">
              <ul className="heading-name-value add-property-heading-name-value">
                <li>id</li>
                <li>Profile img</li>
                <li>Name</li>
                <li>Course Name</li>
                <li>Email</li>
              </ul>
            </div>
           
         

              {users.map((user,index ) =>(
                
                user.isEdit ? 
                studentEditForm && (
                  <div className="overlay">
                    <div className="addStudentDiv" >
                 
                      
                      <form className="Form-div-addstudent" onSubmit={addEditStudent} >
                      <div className="add-backbutton">
                          <label style={{color:"red"}} onClick={()=>{
                          addStudentEditForm(false)
                          user.isEdit= false
                          setUser([...users])
                              // alert("hello")
                          }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="26" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16" style={{marginLeft:"0px",marginTop:"9px" ,position:"absolute",fontWeight:"600px",cursor:"pointer"}}>
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
      </svg>
      </label>
                          <span className="heading-student">Edit Student</span>
                          <button type="submit" className="add">Edit</button>
                           
                        </div>
      
                        <div className="profile-pic-edit">
                          <img src={selectedImage} className="profile-edit"></img>
                 
      
                  </div>
      
      
      
      
      
      
                       <div className="input-fields">
                       <input
                          type="text"                    // autoComplete="current-password"
                          className="id"
                          name="id"
                          placeholder="id"
                          value={user._id}
                          disabled
                          hidden
                        ></input>
                        <label for="firstName">First Name
                        <br />
                        <input
                          type="text"                    // autoComplete="current-password"
                          className="firstName"
                          name="firstName"
                          placeholder="First Name"
                          value={user.firstName} 
                          required
                        ></input>
                        </label>
                   
                        <label for="lastName">Last Name
                        <br />
                        <input
                          type="text"
                          // autoComplete="current-password"
                          className="lastName"
                          name="lastName"
                          placeholder="Last Name"
                         defaultValue={user.lastName}
                         required
                        ></input>
                        </label>
                        <br />
                        <label for="course">Course
                        <br />
                        <input
                          type="text"
                          // autoComplete="current-password"
                          className="course"
                          name="course"
                          placeholder="Course"
                          required
                          defaultValue={user.course} 
                        ></input>
                        </label>
                        <label for="password">Password    
                        <br />
                        <input
                          type="password"
                          // autoComplete="current-password"
                          className="passwordField"
                          name="password"
                          placeholder="Password"
                          required
                          defaultValue={user.password} 
                        ></input>
                        </label>
                        <br />
                        <label for="email">Email
                        <br />
                        <input
                          type="email"
                          // autoComplete="current-password"
                          className="emailField"
                          name="email"
                          placeholder="Email"
                          required
                          defaultValue={user.email}
                        ></input>
                       </label>
                        <label for="phoneNumber">Phone Number
                        <br />
                        <input
                          type="number"
                          // autoComplete="current-password"
                          className="phoneNumber"
                          name="phoneNumber"
                          placeholder="Phone Number"
                          
                          defaultValue={user.phoneNumber}
                        ></input>
                        </label>
                        <br />
                        </div>
                        {/* <p class="sign-in">Already have an account? <b><a href="index.html">Sign Up</a></b></p>  */}
                      </form>
                    </div>
                  </div>
      
                )
                :
                <div className="value-div">
            <ul className="heading-value">
                <li id="serialNumber">{user._id.slice(-10)}</li>
                <li id="profileImage"><img src={user.url} className="pic" /></li>
                <li id="studentName">{user.firstName} {user.lastName}</li>
                <li id="course">{user.course}</li>
                <li id="studentEmail">{user.email}</li>
                <li id='edit' onClick={()=>{
                       
                 users[index].isEdit = true
                 setUser([...users])
                 addStudentEditForm(true)
                 setSelectedImage(user.url)
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg></li>
                <li  id='hide'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                </svg>
                </li>

              </ul>

            </div>
          
                
              
              ))} 
              
          </div>
     </div>

</div>
    )

}
export default Chat;