import react from "react";
import person from "../Components/Assets/person.png";
import email from "../Components/Assets/email.png";
import password from "../Components/Assets/password.png";
import "./LoginPage1.css";

const LoginPage1 = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    

    return (
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
                <div className="input">
                        <img src={person} alt=""/>
                        <input type="text" placeholder="Usuario" />
                </div>
                <div className="input">
                    <img src={password} alt=""/>
                    <input type="text" placeholder="Contraseña" />
                </div>
            </div>
            <div className="submit-container">  
                <button className="submit">Ingresar</button>
                {/* <button className="submit">Registrarse</button> */}
            </div>
        </div>
    );
}

export default LoginPage1;