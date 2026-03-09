import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { getPagos, patchPagos, deletePagos } from '../../services/PagosService';
import { FaSearch, FaEdit, FaTrash, FaEye, FaTimes, FaSave, FaDollarSign, FaCheckCircle, FaClock, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { swalOk, swalConfirmDelete } from '../../utils/swal';
import './GestionVehiculos.css';
import './GestionPagos.css';

const ESTADO_CONFIG = {
    'Completado': { cls: 'gp-estado--ok', icon: <FaCheckCircle /> },
    'Pendiente': { cls: 'gp-estado--pendiente', icon: <FaClock /> },
    'Rechazado': { cls: 'gp-estado--error', icon: <FaTimesCircle /> },
    'En revisión': { cls: 'gp-estado--revision', icon: <FaExclamationTriangle /> },
};

function GestionPagos() {
    const [pagos, setPagos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [pagoModal, setPagoModal] = useState(null);
    const [alerta, setAlerta] = useState(null);

    useEffect(() => { cargarPagos(); }, []);

    const cargarPagos = async () => {
        const data = await getPagos();
        if (data) setPagos(data);
    };

    // ── READ con filtros ────────────────────────────────────────────────────
    const pagosFiltrados = pagos.filter(p => {
        const t = searchTerm.toLowerCase();
        const matchSearch = (p.cliente || '').toLowerCase().includes(t)
            || (p.metodo || '').toLowerCase().includes(t)
            || String(p.id).toLowerCase().includes(t)
            || String(p.idReserva || '').toLowerCase().includes(t);
        const matchEstado = filtroEstado === 'Todos' || (p.estado || 'Completado') === filtroEstado;
        return matchSearch && matchEstado;
    });

    // ── TOTALES ─────────────────────────────────────────────────────────────
    const totalIngresos = pagos
        .filter(p => (p.estado || 'Completado') === 'Completado')
        .reduce((acc, p) => acc + (parseFloat(p.monto) || 0), 0);

    // ── UPDATE (PATCH) ───────────────────────────────────────────────────────
    const handleGuardarPago = async () => {
        await patchPagos(pagoModal, pagoModal.id);
        setPagos(prev => prev.map(p => p.id === pagoModal.id ? pagoModal : p));
        await swalOk('Pago actualizado', `Estado cambiado a '${pagoModal.estado}'.`);
        setPagoModal(null);
    };

    // ── DELETE ───────────────────────────────────────────────────────────────
    const handleEliminar = async (id) => {
        const p = pagos.find(x => x.id === id);
        const result = await swalConfirmDelete(`el pago #${id}${p?.cliente ? ' de ' + p.cliente : ''}`);
        if (!result.isConfirmed) return;
        await deletePagos(id);
        setPagos(prev => prev.filter(p => p.id !== id));
        await swalOk('Registro eliminado', 'El pago fue removido del historial.');
    };

    const formatFecha = (f) => {
        try { return new Date(f).toLocaleString('es-CR'); }
        catch { return f || '—'; }
    };

    return (
        <div className="gestion-page">
            <NavBar />

            {alerta && (
                <div className={`gu-alerta ${alerta.tipo === 'error' ? 'gu-alerta--error' : ''}`}>
                    {alerta.msg}
                </div>
            )}

            <main className="gestion-main">
                <h1 className="gestion-title">Gestión de Pagos 💳</h1>
                <p className="gestion-subtitle">Consulta, edita el estado (PATCH) y elimina registros de transacciones.</p>

                {/* STATS */}
                <div className="gu-stats-row">
                    <div className="gu-stat">
                        <span className="gu-stat-num">{pagos.length}</span>
                        <span className="gu-stat-label">Total Transacciones</span>
                    </div>
                    <div className="gu-stat">
                        <span className="gu-stat-num gp-stat-verde">${totalIngresos.toLocaleString('es-CR', { minimumFractionDigits: 2 })}</span>
                        <span className="gu-stat-label">Ingresos Confirmados</span>
                    </div>
                    <div className="gu-stat">
                        <span className="gu-stat-num">{pagos.filter(p => (p.estado || 'Completado') === 'Pendiente').length}</span>
                        <span className="gu-stat-label">Pendientes de Revisión</span>
                    </div>
                    <div className="gu-stat">
                        <span className="gu-stat-num">{pagos.filter(p => (p.estado || 'Completado') === 'Completado').length}</span>
                        <span className="gu-stat-label">Completados</span>
                    </div>
                </div>

                {/* FILTROS */}
                <div className="gu-toolbar">
                    <div className="gu-search-wrap">
                        <FaSearch className="gu-search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente, método, ID de pago..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="gu-search-input"
                        />
                    </div>
                    <div className="gp-filtro-estado">
                        {['Todos', 'Completado', 'Pendiente', 'En revisión', 'Rechazado'].map(est => (
                            <button
                                key={est}
                                className={`gp-filtro-btn ${filtroEstado === est ? 'gp-filtro-btn--active' : ''}`}
                                onClick={() => setFiltroEstado(est)}
                            >
                                {est}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TABLA */}
                <div className="tabla-wrapper">
                    <table className="tabla-vehiculos">
                        <thead>
                            <tr className="tabla-thead-row">
                                <th className="tabla-th">ID / Cliente</th>
                                <th className="tabla-th">Reserva</th>
                                <th className="tabla-th">Método</th>
                                <th className="tabla-th">Monto</th>
                                <th className="tabla-th">Estado</th>
                                <th className="tabla-th">Fecha</th>
                                <th className="tabla-th tabla-th--center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagosFiltrados.map(p => {
                                const estado = p.estado || 'Completado';
                                const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG['Completado'];
                                return (
                                    <tr key={p.id} className="tabla-row">
                                        <td className="tabla-td">
                                            <div className="tabla-nombre">{p.cliente || '—'}</div>
                                            <div className="tabla-matricula">#{p.id}</div>
                                        </td>
                                        <td className="tabla-td">
                                            <span className="gu-email">{p.idReserva || '—'}</span>
                                        </td>
                                        <td className="tabla-td">
                                            <span className="gp-metodo-badge">{p.metodo || '—'}</span>
                                        </td>
                                        <td className="tabla-td">
                                            <div className="gp-monto">${parseFloat(p.monto || 0).toFixed(2)}</div>
                                            {p.iva !== undefined && (
                                                <div className="gp-monto-det">IVA: ${parseFloat(p.iva || 0).toFixed(2)}</div>
                                            )}
                                        </td>
                                        <td className="tabla-td">
                                            <span className={`gp-estado ${cfg.cls}`}>
                                                {cfg.icon} {estado}
                                            </span>
                                        </td>
                                        <td className="tabla-td">
                                            <span className="gp-fecha">{formatFecha(p.fecha)}</span>
                                        </td>
                                        <td className="tabla-td tabla-td--acciones">
                                            <div className="tabla-acciones">
                                                <button onClick={() => setPagoModal({ ...p })} className="btn-tabla btn-tabla--info">
                                                    <FaEye /> Gestionar
                                                </button>
                                                <button onClick={() => handleEliminar(p.id)} className="btn-tabla btn-tabla--del">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {pagosFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="tabla-vacia">
                                        No hay registros de pago que coincidan con los filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* ─── MODAL GESTIONAR PAGO ─── */}
            {pagoModal && (
                <div className="modal-overlay" onClick={() => setPagoModal(null)}>
                    <div className="modal-box gu-modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                <FaDollarSign /> Detalle de Pago
                                <span className="modal-matricula">#{pagoModal.id}</span>
                            </h2>
                            <button onClick={() => setPagoModal(null)} className="modal-close"><FaTimes /></button>
                        </div>

                        <div className="modal-body gu-modal-body gp-modal-body">

                            {/* Info de solo lectura */}
                            <div className="gp-info-readonly">
                                <div className="gp-info-row">
                                    <span className="gp-info-lbl">Cliente</span>
                                    <span className="gp-info-val">{pagoModal.cliente || '—'}</span>
                                </div>
                                <div className="gp-info-row">
                                    <span className="gp-info-lbl">ID Reserva</span>
                                    <span className="gp-info-val">{pagoModal.idReserva || '—'}</span>
                                </div>
                                <div className="gp-info-row">
                                    <span className="gp-info-lbl">Subtotal</span>
                                    <span className="gp-info-val">${parseFloat(pagoModal.subtotal || 0).toFixed(2)}</span>
                                </div>
                                <div className="gp-info-row">
                                    <span className="gp-info-lbl">IVA (13%)</span>
                                    <span className="gp-info-val">${parseFloat(pagoModal.iva || 0).toFixed(2)}</span>
                                </div>
                                <div className="gp-info-row gp-info-row--total">
                                    <span className="gp-info-lbl">Total</span>
                                    <span className="gp-info-val gp-total">${parseFloat(pagoModal.monto || 0).toFixed(2)}</span>
                                </div>
                                <div className="gp-info-row">
                                    <span className="gp-info-lbl">Fecha</span>
                                    <span className="gp-info-val">{formatFecha(pagoModal.fecha)}</span>
                                </div>
                            </div>

                            {/* Campos editables */}
                            <div className="gu-modal-fields">
                                <div className="modal-field">
                                    <label className="modal-label">Método de Pago</label>
                                    <select
                                        className="modal-select"
                                        value={pagoModal.metodo || ''}
                                        onChange={e => setPagoModal({ ...pagoModal, metodo: e.target.value })}
                                    >
                                        <option value="Transferencia">Transferencia Bancaria</option>
                                        <option value="SINPE Móvil">SINPE Móvil</option>
                                        <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                                        <option value="Efectivo">Efectivo</option>
                                    </select>
                                </div>

                                <div className="modal-field">
                                    <label className="modal-label">Estado del Pago</label>
                                    <select
                                        className="modal-select"
                                        value={pagoModal.estado || 'Completado'}
                                        onChange={e => setPagoModal({ ...pagoModal, estado: e.target.value })}
                                    >
                                        <option value="Completado">✅ Completado</option>
                                        <option value="Pendiente">⏳ Pendiente</option>
                                        <option value="En revisión">🔍 En revisión</option>
                                        <option value="Rechazado">❌ Rechazado</option>
                                    </select>
                                </div>

                                <div className="modal-field">
                                    <label className="modal-label">Observaciones</label>
                                    <textarea
                                        className="modal-input gp-textarea"
                                        placeholder="Notas internas del administrador..."
                                        value={pagoModal.observaciones || ''}
                                        onChange={e => setPagoModal({ ...pagoModal, observaciones: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button onClick={() => setPagoModal(null)} className="btn-modal btn-modal--cancel">
                                <FaTimes /> Cancelar
                            </button>
                            <button onClick={handleGuardarPago} className="btn-modal btn-modal--save">
                                <FaSave /> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default GestionPagos;
