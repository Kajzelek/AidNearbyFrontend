import React from "react";
import "./LoginSignup.css";

import user_icon from "../Assets/user.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/key.png";

const LoginSignup = () => {
  return (
    <div className="container">
        <div className="header">
            <div className="text">Sign Up</div>
            <div className="underline"></div>
        </div>

        <div className="inputs">

            <div className="input">
                <img src={user_icon} alt="" className="icon"/>
                <input type="text" />
            </div>
            
            <div className="input">
                <img src={email_icon} alt="" className="icon"/>
                <input type="email" />
            </div>

            <div className="input">
                <img src={password_icon} alt="" className="icon"/>
                <input type="password" />
            </div>

        </div>

        <div className="submit-container">
            <div className="submit">Sign Up</div>
            <div className="submit">Login</div>
        </div>
    </div>
  );
}

export default LoginSignup;