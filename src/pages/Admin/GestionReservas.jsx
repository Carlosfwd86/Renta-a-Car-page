import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { getReservas, postReservas, patchReservas, deleteReservas } from '../../services/ReservasService';
import { FaCalendarAlt, FaUser, FaIdCard, FaCar, FaDownload, FaTrash, FaCheckCircle, FaClock, FaEdit, FaEye, FaTimes, FaSearch } from 'react-icons/fa';
import './GestionVehiculos.css'; // Reutilizamos los estilos de gestión

function GestionReservas() {
    const [reservas, setReservas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

    const formStateInicial = {
        id: '',
        vehiculoNombre: '',
        cliente: {
            nombre: '',
            identificacion: '',
            email: '',
            telefono: '',
            direccion: '',
            idAdjunto: ''
        },
        fechas: {
            fechaInicio: '',
            fechaFin: ''
        },
        totalDias: 0,
        totalPago: 0,
        estado: 'Reserva Generada'
    };

    const [formData, setFormData] = useState(formStateInicial);
    const [esEdicion, setEsEdicion] = useState(false);

    useEffect(() => {
        cargarReservas();
    }, []);

    const cargarReservas = async () => {
        const data = await getReservas();
        if (data) setReservas(data);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (esEdicion) {
            await patchReservas(formData, formData.id);
            alert("Reserva actualizada correctamente.");
        } else {
            const nuevaReserva = {
                ...formData,
                id: Date.now().toString(),
                fechaCreacion: new Date().toISOString()
            };
            await postReservas(nuevaReserva);
            alert("Reserva creada manualmente.");
        }

        setFormData(formStateInicial);
        setEsEdicion(false);
        cargarReservas();
    };

    const handleEdit = (reserva) => {
        // Aseguramos estructura básica para evitar crashes en el formulario
        const reservaFormateada = {
            ...formStateInicial,
            ...reserva,
            cliente: { ...formStateInicial.cliente, ...reserva.cliente },
            fechas: { ...formStateInicial.fechas, ...reserva.fechas }
        };
        setFormData(reservaFormateada);
        setEsEdicion(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta reserva permanentemente?')) {
            await deleteReservas(id);
            cargarReservas();
        }
    };

    const handleAceptar = async (id) => {
        await patchReservas({ estado: 'Confirmada' }, id);
        alert("Reserva Aceptada y Confirmada.");
        cargarReservas();
    };

    const abrirDetalle = (reserva) => setReservaSeleccionada(reserva);
    const cerrarDetalle = () => setReservaSeleccionada(null);

    // Filtrado de reservas - Robusto contra datos antiguos o incompletos
    const reservasFiltradas = reservas.filter(r => {
        const id = r.id?.toString().toLowerCase() || "";
        const nombreCliente = r.cliente?.nombre?.toLowerCase() || "";
        const vehiculo = r.vehiculoNombre?.toLowerCase() || "";
        const term = searchTerm.toLowerCase();

        return id.includes(term) || nombreCliente.includes(term) || vehiculo.includes(term);
    });

    return (
        <div className="gestion-page">
            <NavBar />

            <main className="gestion-main">
                <div className="gestion-hero">
                    <h1 className="gestion-title">Gestión de <span>Reservas</span></h1>
                    <p className="gestion-subtitle">Administra el ciclo CRUD completo de los alquileres de la flota.</p>
                </div>

                <div className="gestion-grid">
                    {/* PANEL IZQUIERDO: FORMULARIO (CREATE/UPDATE) */}
                    <div className="gestion-panel gestion-panel--sticky">
                        <h2 className="gestion-panel-title">
                            {esEdicion ? 'Modificar Reserva' : 'Registrar Nueva Reserva'}
                        </h2>
                        <form className="gestion-form" onSubmit={handleSubmit}>
                            <div className="form-field">
                                <label className="form-label">Vehículo</label>
                                <input className="form-input" type="text" name="vehiculoNombre" value={formData.vehiculoNombre} onChange={handleInputChange} required placeholder="Ej: Toyota Corolla" />
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label className="form-label">Nombre Cliente</label>
                                    <input className="form-input" type="text" name="cliente.nombre" value={formData.cliente.nombre} onChange={handleInputChange} required />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">ID / Pasaporte</label>
                                    <input className="form-input" type="text" name="cliente.identificacion" value={formData.cliente.identificacion} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="form-label">E-mail</label>
                                <input className="form-input" type="email" name="cliente.email" value={formData.cliente.email} onChange={handleInputChange} required />
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label className="form-label">Teléfono</label>
                                    <input className="form-input" type="text" name="cliente.telefono" value={formData.cliente.telefono} onChange={handleInputChange} required />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Estado</label>
                                    <select className="form-select" name="estado" value={formData.estado} onChange={handleInputChange}>
                                        <option value="Reserva Generada">Reserva Generada</option>
                                        <option value="Confirmada">Confirmada</option>
                                        <option value="Cancelada">Cancelada</option>
                                        <option value="Terminada">Terminada</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label className="form-label">Fecha Inicio</label>
                                    <input className="form-input" type="date" name="fechas.fechaInicio" value={formData.fechas.fechaInicio} onChange={handleInputChange} required />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Fecha Fin</label>
                                    <input className="form-input" type="date" name="fechas.fechaFin" value={formData.fechas.fechaFin} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="form-label">Monto Total (USD)</label>
                                <input className="form-input" type="number" step="0.01" name="totalPago" value={formData.totalPago} onChange={handleInputChange} required />
                            </div>

                            <div className="form-actions">
                                {esEdicion && (
                                    <button type="button" className="btn-cancel" onClick={() => { setFormData(formStateInicial); setEsEdicion(false); }}>Cancelar</button>
                                )}
                                <button type="submit" className="btn-submit">
                                    {esEdicion ? 'Actualizar Reserva' : 'Crear Reserva'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* PANEL DERECHO: LISTADO (READ/DELETE) */}
                    <div className="gestion-panel">
                        <div className="lista-header">
                            <h2 className="lista-titulo">Lista de Reservas</h2>
                            <div className="lista-buscador">
                                <FaSearch style={{ marginRight: '-30px', zIndex: 1, color: '#94a3b8' }} />
                                <input
                                    className="lista-input-buscar"
                                    type="text"
                                    placeholder="Buscar por cliente, ID o auto..."
                                    style={{ paddingLeft: '40px' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="tabla-wrapper">
                            <table className="tabla-vehiculos">
                                <thead className="tabla-thead-row">
                                    <tr>
                                        <th className="tabla-th">Cliente</th>
                                        <th className="tabla-th">Vehículo</th>
                                        <th className="tabla-th">Fechas</th>
                                        <th className="tabla-th">Estado</th>
                                        <th className="tabla-th tabla-th--center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservasFiltradas.length === 0 && (
                                        <tr><td colSpan="5" className="tabla-vacia">No se encontraron reservas.</td></tr>
                                    )}
                                    {reservasFiltradas.map(r => (
                                        <tr key={r.id} className="tabla-row">
                                            <td className="tabla-td">
                                                <div className="tabla-nombre">{r.cliente?.nombre || "N/A"}</div>
                                                <div className="tabla-matricula">ID: {r.cliente?.identificacion || "S/N"}</div>
                                            </td>
                                            <td className="tabla-td">
                                                <div className="tabla-nombre">{r.vehiculoNombre || "Auto Desconocido"}</div>
                                            </td>
                                            <td className="tabla-td" style={{ fontSize: '0.85rem' }}>
                                                <div><strong>In:</strong> {r.fechas?.fechaInicio || r.fechaInicio || "---"}</div>
                                                <div><strong>Out:</strong> {r.fechas?.fechaFin || r.fechaFin || "---"}</div>
                                            </td>
                                            <td className="tabla-td">
                                                <span className={`tabla-estado-badge ${r.estado?.toLowerCase() === 'confirmada' ? 'estado--disponible' : r.estado?.toLowerCase() === 'cancelada' ? 'estado--alerta' : 'estado--advertencia'}`}>
                                                    {r.estado || "Pendiente"}
                                                </span>
                                            </td>
                                            <td className="tabla-td tabla-td--acciones">
                                                <div className="tabla-acciones">
                                                    <button className="btn-tabla btn-tabla--info" onClick={() => abrirDetalle(r)} title="Ver detalles"><FaEye /></button>
                                                    <button className="btn-tabla btn-tabla--edit" onClick={() => handleEdit(r)} title="Editar"><FaEdit /></button>
                                                    {r.estado !== 'Confirmada' && (
                                                        <button className="btn-tabla btn-tabla--info" style={{ backgroundColor: '#10b981' }} onClick={() => handleAceptar(r.id)} title="Aceptar"><FaCheckCircle /></button>
                                                    )}
                                                    <button className="btn-tabla btn-tabla--del" onClick={() => handleDelete(r.id)} title="Eliminar"><FaTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL DE DETALLES (REVISAR) */}
            {reservaSeleccionada && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h2 className="modal-title">
                                Reserva #{reservaSeleccionada.id.substring(0, 8)}
                                <span className="modal-matricula">{reservaSeleccionada.estado}</span>
                            </h2>
                            <button className="modal-close" onClick={cerrarDetalle}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-col">
                                <h3 className="modal-section-title">Datos del Cliente</h3>
                                <div className="modal-field">
                                    <label className="modal-label">Nombre Completo</label>
                                    <input className="modal-input modal-input--readonly" value={reservaSeleccionada.cliente?.nombre || "N/A"} readOnly />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label"># Identificación</label>
                                    <input className="modal-input modal-input--readonly" value={reservaSeleccionada.cliente?.identificacion || "N/A"} readOnly />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">E-mail / Contacto</label>
                                    <input className="modal-input modal-input--readonly" value={reservaSeleccionada.cliente?.email || "N/A"} readOnly />
                                    <input className="modal-input modal-input--readonly" style={{ marginTop: '5px' }} value={reservaSeleccionada.cliente?.telefono || "N/A"} readOnly />
                                </div>
                            </div>
                            <div className="modal-col">
                                <h3 className="modal-section-title">Detalle del Alquiler</h3>
                                <div className="modal-field">
                                    <label className="modal-label">Vehículo Reservado</label>
                                    <input className="modal-input modal-input--readonly" value={reservaSeleccionada.vehiculoNombre || "N/A"} readOnly />
                                </div>
                                <div className="modal-row">
                                    <div className="modal-field">
                                        <label className="modal-label">Fecha Recogida</label>
                                        <input className="modal-input modal-input--readonly" value={reservaSeleccionada.fechas?.fechaInicio || reservaSeleccionada.fechaInicio || "N/A"} readOnly />
                                    </div>
                                    <div className="modal-field">
                                        <label className="modal-label">Fecha Entrega</label>
                                        <input className="modal-input modal-input--readonly" value={reservaSeleccionada.fechas?.fechaFin || reservaSeleccionada.fechaFin || "N/A"} readOnly />
                                    </div>
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">Precio Total Pactado</label>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
                                        ${(reservaSeleccionada.totalPago || reservaSeleccionada.total || 0).toFixed(2)} USD
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-modal btn-modal--cancel" onClick={cerrarDetalle}>Cerrar</button>
                            {reservaSeleccionada.cliente.idAdjunto && (
                                <button className="btn-modal btn-modal--save" onClick={() => alert("Simulando descarga de: " + reservaSeleccionada.cliente.idAdjunto)}>
                                    <FaDownload /> Descargar ID
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default GestionReservas;
