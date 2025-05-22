import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PanelAdmin.css";

const PanelAdmin = () => {
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [reservas, setReservas] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [canchas, setCanchas] = useState([]);
    const [canchaSeleccionada, setCanchaSeleccionada] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("auth")) {
            navigate("/");
        } else {
            cargarReservas();
            cargarCanchas();
        }
    }, []);

    const cargarReservas = async () => {
        try {
            const res = await axios.get("http://localhost:5000/reservas");
            setReservas(res.data);
        } catch (error) {
            console.error("Error cargando reservas", error);
        }
    };

    const cargarCanchas = async () => {
        try {
            const res = await axios.get("http://localhost:5000/canchas");
            setCanchas(res.data);
        } catch (error) {
            console.error("Error cargando canchas", error);
        }
    };

    const reservar = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/reservar", {
                fecha,
                hora,
                cancha_id: canchaSeleccionada,
            });
            if (res.data.success) {
                setMensaje("Reserva creada correctamente");
                cargarReservas();
            }
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al crear la reserva");
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem("auth");
        navigate("/");
    };

    return (
        <div className="panel-container">
            <div className="header">
                <h2>Panel de Administración</h2>
                <button className="cerrar-sesion" onClick={cerrarSesion}>
                    Cerrar sesión
                </button>
            </div>

            <form onSubmit={reservar}>
                <select
                    value={canchaSeleccionada}
                    onChange={(e) => setCanchaSeleccionada(e.target.value)}
                    required
                >
                    <option value="">Selecciona una cancha</option>
                    {canchas.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nombre} ({c.tipo})
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                />
                <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    required
                />
                <button type="submit">Apartar horario</button>
            </form>

            {mensaje && <p className="info">{mensaje}</p>}

            <h3>Horarios Apartados</h3>
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Estado</th>
                        <th>Cancha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map((r, i) => (
                        <tr key={i}>
                            <td>{r.fecha}</td>
                            <td>{r.hora}</td>
                            <td>{r.estado}</td>
                            <td>{r.cancha_nombre}</td>
                            <td>
                                <button
                                    className="eliminar"
                                    onClick={async () => {
                                        try {
                                            await axios.delete(`http://localhost:5000/reservas/${r.id}`);
                                            cargarReservas();
                                        } catch (error) {
                                            setMensaje("Error al eliminar la reserva");
                                        }
                                    }}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PanelAdmin;
