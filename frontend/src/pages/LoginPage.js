import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
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
        <div className="login-container">
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleLogin}>
                <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
                <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Ingresar</button>
                {mensaje && <p className="error">{mensaje}</p>}
            </form>
        </div>
    );
    };

    export default LoginPage;
