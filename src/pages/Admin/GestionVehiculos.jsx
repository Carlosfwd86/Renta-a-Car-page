import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { getVehiculos, postVehiculos, patchVehiculos, deleteVehiculos } from '../../services/VehiculosService';
import './GestionVehiculos.css';

function GestionVehiculos() {
    const [vehiculos, setVehiculos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

    const formStateInicial = {
        id: '', matricula: '', marca: '', modelo: '', categoria: [], precioDia: '', disponible: true, imagen: '', combustible: '', transmision: '', pasajeros: '', traccion: '',
        condicion: 'Óptima', estadoVehiculo: 'Disponible', historialReservas: 0, kilometraje: '', valorFiscal: '', depreciacion: '', mantenimiento: []
    };

    const [formData, setFormData] = useState(formStateInicial);
    const [esEdicion, setEsEdicion] = useState(false);

    useEffect(() => {
        cargarVehiculos();
    }, []);

    const cargarVehiculos = async () => {
        const data = await getVehiculos();
        if (data) setVehiculos(data);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked, options } = e.target;

        if (type === 'select-multiple') {
            const values = Array.from(options)
                .filter(option => option.selected)
                .map(option => option.value);
            setFormData({ ...formData, [name]: values });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let vehiculoFinal = {
            ...formData,
            precioDia: parseFloat(formData.precioDia || 0),
            kilometraje: parseFloat(formData.kilometraje || 0),
            valorFiscal: parseFloat(formData.valorFiscal || 0),
            depreciacion: parseFloat(formData.depreciacion || 0)
        };

        vehiculoFinal.disponible = (vehiculoFinal.estadoVehiculo === 'Disponible' || vehiculoFinal.estadoVehiculo === 'Rentado') ? vehiculoFinal.disponible : false;

        if (esEdicion) {
            await patchVehiculos(vehiculoFinal, formData.id);
        } else {
            vehiculoFinal.id = Date.now().toString();
            await postVehiculos(vehiculoFinal);
        }

        setFormData(formStateInicial);
        setEsEdicion(false);
        cargarVehiculos();
    };

    const handleEdit = (vehiculo) => {
        setFormData({
            ...formStateInicial,
            ...vehiculo,
            categoria: Array.isArray(vehiculo.categoria) ? vehiculo.categoria : (vehiculo.categoria ? [vehiculo.categoria] : []),
            mantenimiento: Array.isArray(vehiculo.mantenimiento) ? vehiculo.mantenimiento : []
        });
        setEsEdicion(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este vehículo permanentemente?')) {
            await deleteVehiculos(id);
            cargarVehiculos();
        }
    };

    const abrirDetalle = (vehiculo) => {
        setVehiculoSeleccionado({
            ...formStateInicial,
            ...vehiculo,
            mantenimiento: Array.isArray(vehiculo.mantenimiento) ? vehiculo.mantenimiento : []
        });
    };

    const cerrarDetalle = () => {
        setVehiculoSeleccionado(null);
    };

    const handleDetalleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            let configAct = [...vehiculoSeleccionado.mantenimiento];
            if (checked) configAct.push(value);
            else configAct = configAct.filter(v => v !== value);
            setVehiculoSeleccionado(prev => ({ ...prev, mantenimiento: configAct }));
        } else {
            setVehiculoSeleccionado({ ...vehiculoSeleccionado, [name]: value });
        }
    };

    const saveDetalles = async () => {
        const vActualizado = {
            ...vehiculoSeleccionado,
            disponible: vehiculoSeleccionado.estadoVehiculo === 'Disponible' || vehiculoSeleccionado.estadoVehiculo === 'Rentado'
        };
        await patchVehiculos(vActualizado, vehiculoSeleccionado.id);
        setVehiculos(prev => prev.map(v => v.id === vehiculoSeleccionado.id ? vActualizado : v));
        alert('Información del vehículo actualizada exitosamente');
        cerrarDetalle();
    };

    const vehiculosFiltrados = vehiculos.filter(v => {
        const term = searchTerm.toLowerCase();
        const mat = (v.matricula || '').toLowerCase();
        const mar = (v.marca || '').toLowerCase();
        const mod = (v.modelo || '').toLowerCase();
        const cat = (Array.isArray(v.categoria) ? v.categoria.join(' ') : (v.categoria || '')).toLowerCase();
        return mat.includes(term) || mar.includes(term) || mod.includes(term) || cat.includes(term);
    });

    return (
        <div className="gestion-page">
            <NavBar />

            <main className="gestion-main">
                <h1 className="gestion-title">Gestión de Flotilla 🚗</h1>
                <p className="gestion-subtitle">Crea, lee, actualiza y elimina (CRUD) todos los vehículos de tu inventario.</p>

                <div className="gestion-grid">

                    {/* PANEL DE FORMULARIO (POST / PATCH) */}
                    <div className="gestion-panel gestion-panel--sticky">
                        <h2 className="gestion-panel-title">
                            {esEdicion ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                        </h2>

                        <form onSubmit={handleSubmit} className="gestion-form">
                            <div className="form-field">
                                <label className="form-label">Matrícula</label>
                                <input type="text" name="matricula" value={formData.matricula} onChange={handleInputChange} required pattern="[A-Za-z0-9]+" title="Solo se permiten letras y números sin espacios" className="form-input form-input--upper" placeholder="Ej: ABC123" />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Marca</label>
                                <input type="text" name="marca" value={formData.marca} onChange={handleInputChange} required className="form-input" placeholder="Ej: Toyota" />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Modelo</label>
                                <input type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} required className="form-input" placeholder="Ej: Yaris 2023" />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Categoría (Puedes seleccionar varias)</label>
                                <select
                                    multiple
                                    name="categoria"
                                    value={Array.isArray(formData.categoria) ? formData.categoria : (formData.categoria ? [formData.categoria] : [])}
                                    onChange={handleInputChange}
                                    required
                                    className="form-select form-select--multi">
                                    <option value="Económico">Económico</option>
                                    <option value="Compacto">Compacto</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Camioneta">Camioneta</option>
                                    <option value="Lujo">Lujo</option>
                                    <option value="Híbrido/Eléctrico">Híbrido/Eléctrico</option>
                                    <option value="Van">Van</option>
                                </select>
                                <small className="form-hint">* Mantén presionado Ctrl (Windows) o Cmd (Mac) para seleccionar múltiples opciones.</small>
                            </div>
                            <div className="form-row">
                                <div className="form-field">
                                    <label className="form-label">Combustible</label>
                                    <select name="combustible" value={formData.combustible} onChange={handleInputChange} required className="form-select">
                                        <option value="">Seleccione...</option>
                                        <option value="Gasolina">Gasolina</option>
                                        <option value="Diesel">Diésel</option>
                                        <option value="Eléctrico">Eléctrico</option>
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Transmisión</label>
                                    <select name="transmision" value={formData.transmision} onChange={handleInputChange} required className="form-select">
                                        <option value="">Seleccione...</option>
                                        <option value="Automática">Automática</option>
                                        <option value="Manual">Manual</option>
                                        <option value="Híbrida">Híbrida</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-field">
                                    <label className="form-label">Pasajeros</label>
                                    <select name="pasajeros" value={formData.pasajeros} onChange={handleInputChange} required className="form-select">
                                        <option value="">Seleccione...</option>
                                        <option value="2">2</option>
                                        <option value="5">5</option>
                                        <option value="7">7</option>
                                        <option value="9">9</option>
                                        <option value="15">15</option>
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Tracción</label>
                                    <select name="traccion" value={formData.traccion} onChange={handleInputChange} required className="form-select">
                                        <option value="">Seleccione...</option>
                                        <option value="4x4">4x4</option>
                                        <option value="4x2">4x2</option>
                                        <option value="FWD">FWD</option>
                                        <option value="RWD">RWD</option>
                                        <option value="AWD">AWD</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-field">
                                <label className="form-label">Precio por Día ($)</label>
                                <input type="number" name="precioDia" value={formData.precioDia} onChange={handleInputChange} required min="1" step="0.01" className="form-input" />
                            </div>
                            <div className="form-field">
                                <label className="form-label">URL de Imagen (Opcional)</label>
                                <input type="url" name="imagen" value={formData.imagen} onChange={handleInputChange} className="form-input" placeholder="https://ejemplo.com/auto.jpg" />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-submit">
                                    {esEdicion ? 'Guardar Cambios' : 'Ingresar Vehículo'}
                                </button>
                                {esEdicion && (
                                    <button type="button" onClick={() => { setEsEdicion(false); setFormData(formStateInicial); }} className="btn-cancel">
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* PANEL DE LISTADO (GET / DELETE) */}
                    <div className="gestion-panel">

                        <div className="lista-header">
                            <h2 className="lista-titulo">Directorio Vehicular ({vehiculosFiltrados.length})</h2>
                            <div className="lista-buscador">
                                <input
                                    type="text"
                                    placeholder="Buscar por matrícula, marca, modelo o categoría..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="lista-input-buscar"
                                />
                            </div>
                        </div>

                        <div className="tabla-wrapper">
                            <table className="tabla-vehiculos">
                                <thead>
                                    <tr className="tabla-thead-row">
                                        <th className="tabla-th">Vehículo</th>
                                        <th className="tabla-th">Categoría</th>
                                        <th className="tabla-th">Estado / Condición</th>
                                        <th className="tabla-th tabla-th--center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehiculosFiltrados.map(v => (
                                        <tr key={v.id} className="tabla-row">
                                            <td className="tabla-td tabla-td--vehiculo">
                                                {v.imagen && (
                                                    <img src={v.imagen} alt={v.modelo} className="tabla-thumb" />
                                                )}
                                                <div>
                                                    <div className="tabla-nombre">{v.marca} <span className="tabla-modelo">{v.modelo}</span></div>
                                                    {v.matricula && <div className="tabla-matricula">{v.matricula.toUpperCase()}</div>}
                                                </div>
                                            </td>
                                            <td className="tabla-td">
                                                <div className="tabla-categorias">
                                                    {(Array.isArray(v.categoria) ? v.categoria : (v.categoria ? [v.categoria] : [])).slice(0, 2).map((cat, idx) => (
                                                        <span key={idx} className="tabla-cat-badge">{cat}</span>
                                                    ))}
                                                    {(Array.isArray(v.categoria) ? v.categoria : []).length > 2 && <span className="tabla-cat-mas">...</span>}
                                                </div>
                                            </td>
                                            <td className="tabla-td">
                                                <div className="tabla-estado-wrap">
                                                    <span className={`tabla-estado-badge ${v.estadoVehiculo === 'Disponible' ? 'estado--disponible' : (v.estadoVehiculo === 'En Mantenimiento' || v.estadoVehiculo === 'Fuera de servicio' ? 'estado--alerta' : 'estado--advertencia')}`}>
                                                        {v.estadoVehiculo || 'Disponible'}
                                                    </span>
                                                </div>
                                                <div className="tabla-condicion">Cond: <span className="tabla-condicion-valor">{v.condicion || 'Óptima'}</span></div>
                                            </td>
                                            <td className="tabla-td tabla-td--acciones">
                                                <div className="tabla-acciones">
                                                    <button onClick={() => abrirDetalle(v)} className="btn-tabla btn-tabla--info">Ficha Info</button>
                                                    <button onClick={() => handleEdit(v)} className="btn-tabla btn-tabla--edit">Editar</button>
                                                    <button onClick={() => handleDelete(v.id)} className="btn-tabla btn-tabla--del">Borrar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {vehiculosFiltrados.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="tabla-vacia">
                                                No hay vehículos que coincidan con la búsqueda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL / CUADRO INFORMATIVO DEL VEHÍCULO */}
            {vehiculoSeleccionado && (
                <div className="modal-overlay">
                    <div className="modal-box">

                        <div className="modal-header">
                            <h2 className="modal-title">
                                {vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo}
                                <span className="modal-matricula">{(vehiculoSeleccionado.matricula || 'S/N').toUpperCase()}</span>
                            </h2>
                            <button onClick={cerrarDetalle} className="modal-close">&times;</button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-col">
                                <h3 className="modal-section-title">Estado y Condición General</h3>

                                <div className="modal-field">
                                    <label className="modal-label">Condición Actual</label>
                                    <select name="condicion" value={vehiculoSeleccionado.condicion} onChange={handleDetalleChange} className="modal-select">
                                        <option value="Óptima">Óptima</option>
                                        <option value="Regular">Regular</option>
                                        <option value="Remplazable">Remplazable</option>
                                    </select>
                                </div>

                                <div className="modal-field">
                                    <label className="modal-label">Disponibilidad / Estado</label>
                                    <select name="estadoVehiculo" value={vehiculoSeleccionado.estadoVehiculo} onChange={handleDetalleChange} className="modal-select">
                                        <option value="Disponible">Disponible</option>
                                        <option value="Rentado">Rentado</option>
                                        <option value="Reservado">Reservado</option>
                                        <option value="Fuera de servicio">Fuera de servicio</option>
                                    </select>
                                </div>

                                <h3 className="modal-section-title modal-section-title--mt">Revisión y Mantenimiento</h3>
                                <div className="modal-mantenimiento-box">
                                    <p className="modal-mantenimiento-desc">Seleccione los mantenimientos pendientes o requeridos:</p>
                                    <label className="modal-check-label">
                                        <input type="checkbox" name="mantenimiento" value="Lavado" checked={(vehiculoSeleccionado.mantenimiento || []).includes('Lavado')} onChange={handleDetalleChange} className="modal-checkbox" />
                                        Lavado y limpieza interior
                                    </label>
                                    <label className="modal-check-label">
                                        <input type="checkbox" name="mantenimiento" value="Revisión general" checked={(vehiculoSeleccionado.mantenimiento || []).includes('Revisión general')} onChange={handleDetalleChange} className="modal-checkbox" />
                                        Revisión general (frenos, fluidos)
                                    </label>
                                    <label className="modal-check-label">
                                        <input type="checkbox" name="mantenimiento" value="Ajustes" checked={(vehiculoSeleccionado.mantenimiento || []).includes('Ajustes')} onChange={handleDetalleChange} className="modal-checkbox" />
                                        Ajustes mecánicos y alineación
                                    </label>
                                </div>
                            </div>

                            <div className="modal-col">
                                <h3 className="modal-section-title">Historial e Información Fiscal</h3>

                                <div className="modal-row">
                                    <div className="modal-field">
                                        <label className="modal-label">Boletas de Reservas</label>
                                        <input type="number" name="historialReservas" value={vehiculoSeleccionado.historialReservas} onChange={handleDetalleChange} min="0" className="modal-input modal-input--readonly" />
                                    </div>
                                    <div className="modal-field">
                                        <label className="modal-label">Kilometraje (Km)</label>
                                        <input type="number" name="kilometraje" value={vehiculoSeleccionado.kilometraje} onChange={handleDetalleChange} min="0" className="modal-input" />
                                    </div>
                                </div>

                                <div className="modal-row">
                                    <div className="modal-field">
                                        <label className="modal-label">Valor Fiscal ($)</label>
                                        <input type="number" name="valorFiscal" value={vehiculoSeleccionado.valorFiscal} onChange={handleDetalleChange} min="0" step="0.01" className="modal-input" />
                                    </div>
                                    <div className="modal-field">
                                        <label className="modal-label">Depreciación (%)</label>
                                        <input type="number" name="depreciacion" value={vehiculoSeleccionado.depreciacion} onChange={handleDetalleChange} min="0" max="100" step="0.1" className="modal-input" />
                                    </div>
                                </div>

                                {vehiculoSeleccionado.imagen && (
                                    <div className="modal-preview">
                                        <img src={vehiculoSeleccionado.imagen} alt="Vehículo" className="modal-preview-img" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button onClick={cerrarDetalle} className="btn-modal btn-modal--cancel">Cerrar</button>
                            <button onClick={saveDetalles} className="btn-modal btn-modal--save">Guardar Actualización</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default GestionVehiculos;
