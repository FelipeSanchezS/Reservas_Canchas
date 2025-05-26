import react from "react";
import person from "../Components/Assets/person.png";
import email from "../Components/Assets/email.png";
import password from "../Components/Assets/password.png";


const LoginPage1 = () => {
    return (
        <div className="container">
            <div className="header">
                <div className="text">Inicia Sesión</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={email} alt=""/>
                    <input type="email" placeholder="Email" />
                </div>
                <div className="input">
                        <img src={person} alt=""/>
                        <input type="text" placeholder="Usuario" />
                </div>
                <div className="input">
                    <img src={password} alt=""/>
                    <input type="text" placeholder="Contraseña" />
                </div>
            </div>
        </div>
    );
}

export default LoginPage1;