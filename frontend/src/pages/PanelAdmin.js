import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PanelAdmin.css";

const PanelAdmin = () => {
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [reservas, setReservas] = useState([]);
    const [mensaje, setMensaje] = useState("");

    const cargarReservas = async () => {
        const res = await axios.get("http://localhost:5000/reservas");
        setReservas(res.data);
    };

    useEffect(() => {
        cargarReservas();
    }, []);

    const reservar = async (e) => {
        e.preventDefault();
        try {
        const res = await axios.post("http://localhost:5000/reservar", {
            fecha,
            hora,
        });
        if (res.data.success) {
            setMensaje("Reserva creada correctamente");
            cargarReservas();
        }
        } catch (error) {
        setMensaje(error.response.data.message);
        }
    };

    return (
        <div className="panel-container">
        <h2>Panel de Administración</h2>
        <form onSubmit={reservar}>
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
            </tr>
            </thead>
            <tbody>
            {reservas.map((r, i) => (
                <tr key={i}>
                <td>{r.fecha}</td>
                <td>{r.hora}</td>
                <td>{r.estado}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default PanelAdmin;
