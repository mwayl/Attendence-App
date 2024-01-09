import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "./signup.css";
import axios from "axios";
// import ResultShower from "../../components/resultShower";
import ResultShower from "../../components/resultShower";

// import { response } from "express";

// for this step you read and display data from state varible
// import { GlobalContext } from '../../context/context'
// const  {state,dispatch}=useContext(GlobalContext);
// <h2>{state.name}</h2>
// import { useContext } from "react";

import { baseUrl } from "../../core";

function Signup() {
  const firstNameInputRef = useRef(null);
  const lastNameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const [showPasswordDiv, dontShowPasswordDiv] = useState("hidden");
  const [showServerMessageDiv, dontShowServerMessageDiv] = useState("hidden");
  const [messageFromServer, setMessageFromServer] = useState("");
  //  const  {state,dispatch}=useContext(GlobalContext);
  //  let messageFromServer;
  //  let message

  const submitInformationHandler = async (e) => {
    e.preventDefault();
    try {
      if (
        passwordInputRef.current.value !== confirmPasswordInputRef.current.value
      ) {
        dontShowPasswordDiv("");
        setTimeout(() => {
          dontShowPasswordDiv("hidden");
        }, 3000);
        return;
      }

      const response = await axios.post(`${baseUrl}/api/v1/signup`, {
        firstName: firstNameInputRef.current.value,
        lastName: lastNameInputRef.current.value,
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
      });

      console.log(response.data.message);
      setMessageFromServer(response.data.message);
      dontShowServerMessageDiv("");
      setTimeout(() => {
        dontShowServerMessageDiv("hidden");
      }, 3000);
    } catch (err) {
      console.log(err);
      console.log(err.response.data.message);
      setMessageFromServer(err.response.data.message);
      dontShowServerMessageDiv("");
      setTimeout(() => {
        dontShowServerMessageDiv("hidden");
      }, 3000);
    }
  };

  return (
    <div className="Main">
      <div className="header">
        <h1 className="main-heading">Personal Blogging App</h1>
        {/* <button className="log-in">
          <a className="login-link" href="login.html">
            Log In
          </a>
        </button> */}
      </div>
      <div className="inner-header">
        <h1 className="heading-of-Page">Signup</h1>
      </div>

      <form className="Form-div" onSubmit={submitInformationHandler}>
        <h3>Sigup Form</h3>
        <br />

        <input
          type="text"
          className="first-name"
          autoComplete="given-name"
          name="firstname"
          placeholder="First Name"
          ref={firstNameInputRef}
        ></input>
        <br />
        <input
          type="text"
          className="last-name"
          autoComplete="family-name"
          name="lastname"
          placeholder="Last Name"
          ref={lastNameInputRef}
        ></input>
        <br />
        <input
          type="email"
          className="email"
          autoComplete="email"
          name="email"
          placeholder="Email"
          ref={emailInputRef}
        ></input>
        <br />
        <input
          type="password"
          autoComplete="new-password"
          className="password"
          name="password"
          placeholder="Password"
          ref={passwordInputRef}
        ></input>
        <br />
        <input
          type="password"
          autoComplete="new-password"
          className="password-checker"
          name="password-checker"
          placeholder="Repeat Password"
          ref={confirmPasswordInputRef}
        ></input>
        <br />
        <button className="signup">Signup</button>
        {/* <p class="sign-in">Already have an account? <b><a href="index.html">Sign Up</a></b></p>  */}
        <div className="login-here">
          <p>Already have an account <NavLink to="/login">Login</NavLink></p>
        </div>
      </form>

      {/* <div className={`passwordChecker ${showPasswordDiv}`}>
        <p className="error">Your Password is incorrect</p>
       </div> */}
      <div className={`${showPasswordDiv}`}>
        <ResultShower message="Your Password is incorrect" />
      </div>
      <div className={`${showServerMessageDiv}`}>
        <ResultShower
          message={messageFromServer && <p>{messageFromServer}</p>}
        />
      </div>
    </div>
  );
}

export default Signup;
