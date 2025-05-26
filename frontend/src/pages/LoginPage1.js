// import react from "react";
import person from "../Components/Assets/person.png";
import email from "../Components/Assets/email.png";
import password from "../Components/Assets/password.png";
import "./LoginPage1.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage1 = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        const res = await axios.post("http://localhost:5000/login", {
            username,
            password,
        });
        if (res.data.success) {
            localStorage.setItem("auth", "true");
            navigate("/panel");
        } else {
            setMensaje("Credenciales incorrectas");
        }
        } catch (error) {
        setMensaje("Credenciales incorrectas");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="container">
                <div className="header">
                    <div className="text">Inicia Sesión</div>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    {/* <div className="input">
                        <img src={email} alt=""/>
                        <input type="email" placeholder="Email" />
                    </div> */}
                    <p className="text-input">Usuario</p>
                    <div className="input">
                            <img src={person} alt=""/>
                            <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <p className="text-input">Contraseña</p>
                    <div className="input">
                        <img src={email} alt=""/>
                        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                </div>
                <div className="submit-container">  
                    <button className="submit">Ingresar</button>
                    {mensaje && <p className="error">{mensaje}</p>}
                    {/* <button className="submit">Registrarse</button> */}
                </div>
            </div>
        </form>

    );
}

export default LoginPage1;