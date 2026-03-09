import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { getUsuarios, patchUsuarios, deleteUsuarios, postUsuarios } from '../../services/UsuariosService';
import { FaUserCircle, FaSearch, FaEdit, FaTrash, FaEye, FaTimes, FaSave, FaUserPlus, FaShieldAlt } from 'react-icons/fa';
import { swalOk, swalError, swalConfirmDelete } from '../../utils/swal';
import './GestionVehiculos.css';
import './GestionUsuarios.css';

const ROL_BADGE = {
    admin: { label: 'Administrador', cls: 'badge-admin' },
    cliente: { label: 'Cliente', cls: 'badge-cliente' },
};

function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [usuarioModal, setUsuarioModal] = useState(null);
    const [modoCrear, setModoCrear] = useState(false);
    const [formNuevo, setFormNuevo] = useState({ nombre: '', email: '', password: '', rol: 'cliente' });

    useEffect(() => { cargarUsuarios(); }, []);

    const cargarUsuarios = async () => {
        const data = await getUsuarios();
        if (data) setUsuarios(data);
    };

    // ── READ ─────────────────────────────────────────────────────────────────
    const usuariosFiltrados = usuarios.filter(u => {
        const t = searchTerm.toLowerCase();
        return (u.nombre || '').toLowerCase().includes(t)
            || (u.email || '').toLowerCase().includes(t)
            || (u.rol || '').toLowerCase().includes(t);
    });

    // ── CREATE ────────────────────────────────────────────────────────────────
    const handleCrear = async (e) => {
        e.preventDefault();
        if (!formNuevo.nombre || !formNuevo.email || !formNuevo.password) {
            await swalError('Campos incompletos', 'Completa todos los campos requeridos.');
            return;
        }
        const nuevo = { ...formNuevo, id: Date.now().toString() };
        await postUsuarios(nuevo);
        await swalOk('Usuario creado', `${formNuevo.nombre} ha sido registrado correctamente.`);
        setModoCrear(false);
        setFormNuevo({ nombre: '', email: '', password: '', rol: 'cliente' });
        cargarUsuarios();
    };

    // ── UPDATE (PATCH) ────────────────────────────────────────────────────────
    const handleGuardarEdicion = async () => {
        if (!usuarioModal.nombre || !usuarioModal.email) {
            await swalError('Datos incompletos', 'Nombre y email son obligatorios.');
            return;
        }
        await patchUsuarios(usuarioModal, usuarioModal.id);
        setUsuarios(prev => prev.map(u => u.id === usuarioModal.id ? usuarioModal : u));
        await swalOk('Cambios guardados', `El perfil de ${usuarioModal.nombre} fue actualizado.`);
        setUsuarioModal(null);
    };

    // ── DELETE ────────────────────────────────────────────────────────────────
    const handleEliminar = async (id) => {
        const u = usuarios.find(x => x.id === id);
        const result = await swalConfirmDelete(u ? `al usuario ${u.nombre}` : 'este usuario');
        if (!result.isConfirmed) return;
        await deleteUsuarios(id);
        setUsuarios(prev => prev.filter(u => u.id !== id));
        await swalOk('Usuario eliminado', 'El registro fue removido del sistema.');
    };

    return (
        <div className="gestion-page">
            <NavBar />

            <main className="gestion-main">
                <h1 className="gestion-title">Gestión de Usuarios 🧑‍💼</h1>
                <p className="gestion-subtitle">Visualiza, edita (PATCH), crea o elimina cuentas del sistema.</p>

                {/* BARRA DE HERRAMIENTAS */}
                <div className="gu-toolbar">
                    <div className="gu-search-wrap">
                        <FaSearch className="gu-search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o rol..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="gu-search-input"
                        />
                    </div>
                    <button className="gu-btn-nuevo" onClick={() => setModoCrear(true)}>
                        <FaUserPlus /> Nuevo Usuario
                    </button>
                </div>

                {/* STATS RÁPIDAS */}
                <div className="gu-stats-row">
                    <div className="gu-stat">
                        <span className="gu-stat-num">{usuarios.length}</span>
                        <span className="gu-stat-label">Total Registros</span>
                    </div>
                    <div className="gu-stat">
                        <span className="gu-stat-num">{usuarios.filter(u => u.rol === 'admin').length}</span>
                        <span className="gu-stat-label">Administradores</span>
                    </div>
                    <div className="gu-stat">
                        <span className="gu-stat-num">{usuarios.filter(u => u.rol === 'cliente').length}</span>
                        <span className="gu-stat-label">Clientes</span>
                    </div>
                </div>

                {/* TABLA DE USUARIOS */}
                <div className="tabla-wrapper">
                    <table className="tabla-vehiculos">
                        <thead>
                            <tr className="tabla-thead-row">
                                <th className="tabla-th">Usuario</th>
                                <th className="tabla-th">Email</th>
                                <th className="tabla-th">Rol</th>
                                <th className="tabla-th tabla-th--center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.map(u => (
                                <tr key={u.id} className="tabla-row">
                                    <td className="tabla-td tabla-td--vehiculo">
                                        <div className="gu-avatar">
                                            <FaUserCircle className="gu-avatar-icon" />
                                            <div>
                                                <div className="tabla-nombre">{u.nombre}</div>
                                                <div className="tabla-matricula">ID: {u.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="tabla-td">
                                        <span className="gu-email">{u.email}</span>
                                    </td>
                                    <td className="tabla-td">
                                        <span className={`gu-rol-badge ${ROL_BADGE[u.rol]?.cls || 'badge-cliente'}`}>
                                            {u.rol === 'admin' && <FaShieldAlt />}
                                            {ROL_BADGE[u.rol]?.label || u.rol}
                                        </span>
                                    </td>
                                    <td className="tabla-td tabla-td--acciones">
                                        <div className="tabla-acciones">
                                            <button onClick={() => setUsuarioModal({ ...u })} className="btn-tabla btn-tabla--info">
                                                <FaEye /> Ver / Editar
                                            </button>
                                            <button onClick={() => handleEliminar(u.id)} className="btn-tabla btn-tabla--del">
                                                <FaTrash /> Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {usuariosFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="tabla-vacia">
                                        No hay usuarios que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* ─── MODAL VER / EDITAR USUARIO ─── */}
            {usuarioModal && (
                <div className="modal-overlay" onClick={() => setUsuarioModal(null)}>
                    <div className="modal-box gu-modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                <FaUserCircle /> Perfil de Usuario
                                <span className="modal-matricula">{usuarioModal.id}</span>
                            </h2>
                            <button onClick={() => setUsuarioModal(null)} className="modal-close"><FaTimes /></button>
                        </div>

                        <div className="modal-body gu-modal-body">
                            <div className="gu-modal-avatar-section">
                                <div className="gu-big-avatar">
                                    <FaUserCircle />
                                </div>
                                <span className={`gu-rol-badge ${ROL_BADGE[usuarioModal.rol]?.cls || 'badge-cliente'}`}>
                                    {ROL_BADGE[usuarioModal.rol]?.label || usuarioModal.rol}
                                </span>
                            </div>

                            <div className="gu-modal-fields">
                                <div className="modal-field">
                                    <label className="modal-label">Nombre Completo</label>
                                    <input
                                        className="modal-input"
                                        type="text"
                                        value={usuarioModal.nombre}
                                        onChange={e => setUsuarioModal({ ...usuarioModal, nombre: e.target.value })}
                                    />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">Correo Electrónico</label>
                                    <input
                                        className="modal-input"
                                        type="email"
                                        value={usuarioModal.email}
                                        onChange={e => setUsuarioModal({ ...usuarioModal, email: e.target.value })}
                                    />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">Contraseña</label>
                                    <input
                                        className="modal-input"
                                        type="password"
                                        value={usuarioModal.password || ''}
                                        onChange={e => setUsuarioModal({ ...usuarioModal, password: e.target.value })}
                                        placeholder="Nueva contraseña (dejar vacío para no cambiar)"
                                    />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">Rol del Sistema</label>
                                    <select
                                        className="modal-select"
                                        value={usuarioModal.rol}
                                        onChange={e => setUsuarioModal({ ...usuarioModal, rol: e.target.value })}
                                    >
                                        <option value="cliente">Cliente</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button onClick={() => setUsuarioModal(null)} className="btn-modal btn-modal--cancel">
                                <FaTimes /> Cancelar
                            </button>
                            <button onClick={handleGuardarEdicion} className="btn-modal btn-modal--save">
                                <FaSave /> Guardar Cambios (PATCH)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── MODAL CREAR USUARIO ─── */}
            {modoCrear && (
                <div className="modal-overlay" onClick={() => setModoCrear(false)}>
                    <div className="modal-box gu-modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title"><FaUserPlus /> Crear Nuevo Usuario</h2>
                            <button onClick={() => setModoCrear(false)} className="modal-close"><FaTimes /></button>
                        </div>

                        <form onSubmit={handleCrear} className="modal-body gu-modal-body">
                            <div className="gu-modal-fields" style={{ width: '100%' }}>
                                <div className="modal-field">
                                    <label className="modal-label">Nombre Completo *</label>
                                    <input
                                        className="modal-input"
                                        type="text"
                                        required
                                        placeholder="Ej: Juan Pérez"
                                        value={formNuevo.nombre}
                                        onChange={e => setFormNuevo({ ...formNuevo, nombre: e.target.value })}
                                    />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">Correo Electrónico *</label>
                                    <input
                                        className="modal-input"
                                        type="email"
                                        required
                                        placeholder="usuario@rentaya.com"
                                        value={formNuevo.email}
                                        onChange={e => setFormNuevo({ ...formNuevo, email: e.target.value })}
                                    />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">Contraseña *</label>
                                    <input
                                        className="modal-input"
                                        type="password"
                                        required
                                        placeholder="Mínimo 8 caracteres"
                                        value={formNuevo.password}
                                        onChange={e => setFormNuevo({ ...formNuevo, password: e.target.value })}
                                    />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">Rol</label>
                                    <select
                                        className="modal-select"
                                        value={formNuevo.rol}
                                        onChange={e => setFormNuevo({ ...formNuevo, rol: e.target.value })}
                                    >
                                        <option value="cliente">Cliente</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setModoCrear(false)} className="btn-modal btn-modal--cancel">
                                    <FaTimes /> Cancelar
                                </button>
                                <button type="submit" className="btn-modal btn-modal--save">
                                    <FaUserPlus /> Crear Usuario (POST)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default GestionUsuarios;
