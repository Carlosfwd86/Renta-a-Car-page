import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { getNotificaciones, markAsRead } from '../../services/NotificacionesService';
import { FaBell, FaInfoCircle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './Admin.css';

function Admin() {
    const [notificaciones, setNotificaciones] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarNotificaciones();
    }, []);

    const cargarNotificaciones = async () => {
        const data = await getNotificaciones();
        if (data) {
            // Ordenamos por fecha descendente
            const ordenadas = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            setNotificaciones(ordenadas);
        }
        setCargando(false);
    };

    const handleLeer = async (id) => {
        await markAsRead(id);
        cargarNotificaciones();
    };

    return (
        <div className="admin-page">
            <NavBar />

            <main className="admin-main">
                <div className="admin-hero">
                    <h1 className="admin-title">Panel Administrativo</h1>
                    <p className="admin-subtitle">Bienvenido al dashboard de administración de <strong>RentaYA</strong>.</p>
                </div>

                {/* Centro de Notificaciones (Simulación de Correo) */}
                <div className="admin-notifications-section">
                    <div className="notif-header">
                        <h2><FaBell /> Avisos del Sistema</h2>
                        <button className="notif-refresh" onClick={cargarNotificaciones}>Actualizar</button>
                    </div>
                    <div className="notif-list">
                        {notificaciones.length === 0 && !cargando && <p className="notif-empty">No hay avisos pendientes.</p>}
                        {notificaciones.map(n => (
                            <div key={n.id} className={`notif-item ${n.leida ? 'notif-read' : 'notif-unread'}`}>
                                <div className="notif-icon">
                                    {n.tipo === 'PAGO_RECIBIDO' ? <FaCheckCircle style={{ color: '#10b981' }} /> : <FaInfoCircle />}
                                </div>
                                <div className="notif-body">
                                    <p className="notif-msg">{n.mensaje}</p>
                                    <span className="notif-date">{new Date(n.fecha).toLocaleString()}</span>
                                </div>
                                {!n.leida && (
                                    <button className="notif-action" onClick={() => handleLeer(n.id)}>Marcar leído</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="admin-grid">
                    <Link to="/admin/vehiculos" className="admin-card-link">
                        <div className="admin-card">
                            <div className="admin-card-icon">🚗</div>
                            <h3>Gestión de Vehículos</h3>
                            <p>Añade, edita (PATCH) o elimina vehículos bajo el estándar CRUD completo.</p>
                            <span className="admin-card-cta">Administrar →</span>
                        </div>
                    </Link>

                    <Link to="/admin/reservas" className="admin-card-link">
                        <div className="admin-card">
                            <div className="admin-card-icon">📅</div>
                            <h3>Gestión de Reservas</h3>
                            <p>Revisa solicitudes, verifica documentacion (ID/Pasaporte) y administra alquileres activos.</p>
                            <span className="admin-card-cta">Administrar →</span>
                        </div>
                    </Link>

                    <Link to="/admin/pagos" className="admin-card-link">
                        <div className="admin-card">
                            <div className="admin-card-icon">💳</div>
                            <h3>Gestión de Pagos</h3>
                            <p>Revisa el historial de transacciones, actualiza estados (PATCH) y gestiona comprobantes.</p>
                            <span className="admin-card-cta">Administrar →</span>
                        </div>
                    </Link>

                    <Link to="/admin/usuarios" className="admin-card-link">
                        <div className="admin-card">
                            <div className="admin-card-icon">🧑‍💼</div>
                            <h3>Gestión de Usuarios</h3>
                            <p>Visualiza, edita perfiles, cambia roles (PATCH) y elimina cuentas del sistema.</p>
                            <span className="admin-card-cta">Administrar →</span>
                        </div>
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Admin;
