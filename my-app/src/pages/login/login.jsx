import React, { useContext, useRef, useState } from "react";
import "./login.css";
import axios from "axios";
import ResultShower from "../../components/resultShower";
import { GlobalContext } from "../../context/context";
import { NavLink } from "react-router-dom";

import { baseUrl } from "../../core";

function Login() {
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [showServerMessageDiv, dontShowServerMessageDiv] = useState("hidden");
  const [messageFromServer, setMessageFromServer] = useState("");
  const { state, dispatch } = useContext(GlobalContext);

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/login`,
        {
          email: emailInputRef.current.value,
          password: passwordInputRef.current.value,
        },
        {
          withCredentials: true,
        }
      );
      dispatch({
        type: "USER_LOGIN",
        payload:response.data.data
      });
console.log("helllooooooooooo "+response.data.data)
      // console.log("namae"+response.data.data.firstName)
      console.log(response.data ? response.data.message : undefined);
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
      <div className="header-login">
        <h1 className="main-heading1">Attendance Managment System</h1>
        {/* <button className="log-in">
          <a className="login-link" href="login.html">
            Sign up
          </a>
        </button> */}
      </div>
      <div className="inner-header-login">
        <h1 className="heading-of-Page">Login</h1>
        {/* <h2>{state.name}<button onClick={changeNameHandler}>Change Name</button></h2> */}
      </div>

      <form className="Form-div-login1" onSubmit={loginHandler}>
        <h1>Login Form</h1>
        <br />

        <input
          type="email"
          className="loginEmail1"
          autoComplete="email"
          name="email"
          placeholder="Email"
          ref={emailInputRef}
        ></input>
        <br />
        <input
          type="password"
          autoComplete="current-password"
          className="loginPassword1"
          name="password"
          placeholder="Password"
          ref={passwordInputRef}
        ></input>
        <br />

        <button className="login1">Login</button>
        {/* <p class="sign-in">Already have an account? <b><a href="index.html">Sign Up</a></b></p>  */}

        {/* <div className="login-signup-functionality">
          <p>Don't have an account ? <NavLink to="/signup">Signup</NavLink></p>
        </div> */}
      </form>
      <div className={`${showServerMessageDiv}`}>
        <ResultShower
          message={messageFromServer && <p>{messageFromServer}</p>}
        />
      </div>
    </div>
  );
}

export default Login;
