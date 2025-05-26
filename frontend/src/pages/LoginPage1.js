import react from "react";
import user_icon from "../assets/user-icon.png";
import email_icon from "../assets/email-icon.png";
import password_icon from "../assets/password-icon.png";
import "./LoginPage1.css";

const LoginPage1 = () => {
    return (
        <div className="container">
            <div className="header">
                <div className="text">Inicia Sesión</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={email_icon} alt=""/>
                    <input type="email" placeholder="Email" />
                </div>
                <div className="input">
                        <img src={user_icon} alt=""/>
                        <input type="text" placeholder="Usuario" />
                </div>
                <div className="input">
                    <img src={password_icon} alt=""/>
                    <input type="text" placeholder="Contraseña" />
                </div>
            </div>
        </div>
    );
}

export default LoginPage1;