import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { getVehiculos, postVehiculos, patchVehiculos, deleteVehiculos } from '../../services/VehiculosService';

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

        // Formatear la subida final asegurando un número en precioDia, etc
        let vehiculoFinal = {
            ...formData,
            precioDia: parseFloat(formData.precioDia || 0),
            kilometraje: parseFloat(formData.kilometraje || 0),
            valorFiscal: parseFloat(formData.valorFiscal || 0),
            depreciacion: parseFloat(formData.depreciacion || 0)
        };

        // Mantener sincronizado el bool "disponible" según el texto si se requiere o a mano
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
            ...formStateInicial, // Asegurar que tenga todos los campos por si es antiguo
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

    // Funciones del Modal de Detalles
    const abrirDetalle = (vehiculo) => {
        setVehiculoSeleccionado({
            ...formStateInicial, // Valores por defecto para autos viejos sin estos props
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
        // Al guardar el modal, empatamos el bool 'disponible' si el estado es Disponible
        const vActualizado = {
            ...vehiculoSeleccionado,
            disponible: vehiculoSeleccionado.estadoVehiculo === 'Disponible' || vehiculoSeleccionado.estadoVehiculo === 'Rentado'
        };
        await patchVehiculos(vActualizado, vehiculoSeleccionado.id);
        setVehiculos(prev => prev.map(v => v.id === vehiculoSeleccionado.id ? vActualizado : v));
        alert('Información del vehículo actualizada exitosamente');
        cerrarDetalle();
    };


    // Filtro del buscador
    const vehiculosFiltrados = vehiculos.filter(v => {
        const term = searchTerm.toLowerCase();
        const mat = (v.matricula || '').toLowerCase();
        const mar = (v.marca || '').toLowerCase();
        const mod = (v.modelo || '').toLowerCase();
        const cat = (Array.isArray(v.categoria) ? v.categoria.join(' ') : (v.categoria || '')).toLowerCase();
        return mat.includes(term) || mar.includes(term) || mod.includes(term) || cat.includes(term);
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <NavBar />

            <main style={{ flexGrow: 1, padding: '40px', maxWidth: '1300px', margin: '0 auto', width: '100%' }}>
                <h1 style={{ color: 'hsl(209, 69%, 10%)', marginBottom: '10px' }}>Gestión de Flotilla 🚗</h1>
                <p style={{ marginBottom: '30px', color: '#666' }}>Crea, lee, actualiza y elimina (CRUD) todos los vehículos de tu inventario.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>

                    {/* PANEL DE FORMULARIO (POST / PATCH) */}
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'sticky', top: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>
                            {esEdicion ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Matrícula</label>
                                <input type="text" name="matricula" value={formData.matricula} onChange={handleInputChange} required pattern="[A-Za-z0-9]+" title="Solo se permiten letras y números sin espacios" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', textTransform: 'uppercase' }} placeholder="Ej: ABC123" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Marca</label>
                                <input type="text" name="marca" value={formData.marca} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} placeholder="Ej: Toyota" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Modelo</label>
                                <input type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} placeholder="Ej: Yaris 2023" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Categoría (Puedes seleccionar varias)</label>
                                <select
                                    multiple
                                    name="categoria"
                                    value={Array.isArray(formData.categoria) ? formData.categoria : (formData.categoria ? [formData.categoria] : [])}
                                    onChange={handleInputChange}
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '130px' }}>
                                    <option value="Económico">Económico</option>
                                    <option value="Compacto">Compacto</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Camioneta">Camioneta</option>
                                    <option value="Lujo">Lujo</option>
                                    <option value="Híbrido/Eléctrico">Híbrido/Eléctrico</option>
                                    <option value="Van">Van</option>
                                </select>
                                <small style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginTop: '4px' }}>* Mantén presionado Ctrl (Windows) o Cmd (Mac) para seleccionar múltiples opciones.</small>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Combustible</label>
                                    <select name="combustible" value={formData.combustible} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                        <option value="">Seleccione...</option>
                                        <option value="Gasolina">Gasolina</option>
                                        <option value="Diesel">Diésel</option>
                                        <option value="Eléctrico">Eléctrico</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Transmisión</label>
                                    <select name="transmision" value={formData.transmision} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                        <option value="">Seleccione...</option>
                                        <option value="Automática">Automática</option>
                                        <option value="Manual">Manual</option>
                                        <option value="Híbrida">Híbrida</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Pasajeros</label>
                                    <select name="pasajeros" value={formData.pasajeros} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                        <option value="">Seleccione...</option>
                                        <option value="2">2</option>
                                        <option value="5">5</option>
                                        <option value="7">7</option>
                                        <option value="9">9</option>
                                        <option value="15">15</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Tracción</label>
                                    <select name="traccion" value={formData.traccion} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                        <option value="">Seleccione...</option>
                                        <option value="4x4">4x4</option>
                                        <option value="4x2">4x2</option>
                                        <option value="FWD">FWD</option>
                                        <option value="RWD">RWD</option>
                                        <option value="AWD">AWD</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Precio por Día ($)</label>
                                <input type="number" name="precioDia" value={formData.precioDia} onChange={handleInputChange} required min="1" step="0.01" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>URL de Imagen (Opcional)</label>
                                <input type="url" name="imagen" value={formData.imagen} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} placeholder="https://ejemplo.com/auto.jpg" />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: 'hsl(209, 69%, 10%)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'opacity 0.2s' }}>
                                    {esEdicion ? 'Guardar Cambios' : 'Ingresar Vehículo'}
                                </button>
                                {esEdicion && (
                                    <button type="button" onClick={() => { setEsEdicion(false); setFormData(formStateInicial); }} style={{ flex: 1, padding: '12px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'background-color 0.2s' }}>
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* PANEL DE LISTADO (GET / DELETE) */}
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '15px' }}>
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Directorio Vehicular ({vehiculosFiltrados.length})</h2>

                            {/* Buscador */}
                            <div style={{ display: 'flex', alignItems: 'center', width: '350px' }}>
                                <input
                                    type="text"
                                    placeholder="Buscar por matrícula, marca, modelo o categoría..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '100%', padding: '10px 15px', borderRadius: '20px', border: '1px solid #ccc', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                                        <th style={{ padding: '14px 12px', color: '#475569' }}>Vehículo</th>
                                        <th style={{ padding: '14px 12px', color: '#475569' }}>Categoría</th>
                                        <th style={{ padding: '14px 12px', color: '#475569' }}>Estado / Condición</th>
                                        <th style={{ padding: '14px 12px', color: '#475569', textAlign: 'center' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehiculosFiltrados.map(v => (
                                        <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                                            <td style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {v.imagen && (
                                                    <img src={v.imagen} alt={v.modelo} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }} />
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{v.marca} <span style={{ fontWeight: 'normal', color: '#64748b' }}>{v.modelo}</span></div>
                                                    {v.matricula && <div style={{ fontSize: '0.75em', color: '#94a3b8', marginTop: '2px', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', fontWeight: 'bold', letterSpacing: '0.5px' }}>{v.matricula.toUpperCase()}</div>}
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 12px' }}>
                                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                    {(Array.isArray(v.categoria) ? v.categoria : (v.categoria ? [v.categoria] : [])).slice(0, 2).map((cat, idx) => (
                                                        <span key={idx} style={{
                                                            backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85em'
                                                        }}>{cat}</span>
                                                    ))}
                                                    {(Array.isArray(v.categoria) ? v.categoria : []).length > 2 && <span style={{ fontSize: '0.8em', color: '#64748b' }}>...</span>}
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 12px' }}>
                                                <div style={{ marginBottom: '4px' }}>
                                                    <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', backgroundColor: v.estadoVehiculo === 'Disponible' ? '#dcfce7' : (v.estadoVehiculo === 'En Mantenimiento' || v.estadoVehiculo === 'Fuera de servicio' ? '#fee2e2' : '#fef9c3'), color: v.estadoVehiculo === 'Disponible' ? '#166534' : (v.estadoVehiculo === 'En Mantenimiento' || v.estadoVehiculo === 'Fuera de servicio' ? '#991b1b' : '#854d0e'), fontWeight: '600' }}>
                                                        {v.estadoVehiculo || 'Disponible'}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                    Cond: <span style={{ fontWeight: '500', color: '#333' }}>{v.condicion || 'Óptima'}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', flexWrap: 'wrap' }}>
                                                    <button onClick={() => abrirDetalle(v)} style={{ padding: '6px 10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Ficha Info</button>
                                                    <button onClick={() => handleEdit(v)} style={{ padding: '6px 10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Editar</button>
                                                    <button onClick={() => handleDelete(v.id)} style={{ padding: '6px 10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Borrar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {vehiculosFiltrados.length === 0 && (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
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
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

                        <div style={{ padding: '20px 25px', backgroundColor: 'hsl(209, 69%, 10%)', color: 'white', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo}
                                <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.9rem', letterSpacing: '1px' }}>{(vehiculoSeleccionado.matricula || 'S/N').toUpperCase()}</span>
                            </h2>
                            <button onClick={cerrarDetalle} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
                        </div>

                        <div style={{ padding: '25px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            {/* Columna Izquierda - Estado General */}
                            <div>
                                <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px', color: '#1e293b' }}>Estado y Condición General</h3>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem', color: '#475569' }}>Condición Actual</label>
                                    <select name="condicion" value={vehiculoSeleccionado.condicion} onChange={handleDetalleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                        <option value="Óptima">Óptima</option>
                                        <option value="Regular">Regular</option>
                                        <option value="Remplazable">Remplazable</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem', color: '#475569' }}>Disponibilidad / Estado</label>
                                    <select name="estadoVehiculo" value={vehiculoSeleccionado.estadoVehiculo} onChange={handleDetalleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                        <option value="Disponible">Disponible</option>
                                        <option value="Rentado">Rentado</option>
                                        <option value="Reservado">Reservado</option>
                                        <option value="Fuera de servicio">Fuera de servicio</option>
                                    </select>
                                </div>

                                <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px', marginTop: '30px', color: '#1e293b' }}>Revisión y Mantenimiento</h3>
                                <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#64748b' }}>Seleccione los mantenimientos pendientes o requeridos:</p>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                                        <input type="checkbox" name="mantenimiento" value="Lavado" checked={(vehiculoSeleccionado.mantenimiento || []).includes('Lavado')} onChange={handleDetalleChange} style={{ width: '18px', height: '18px' }} />
                                        Lavado y limpieza interior
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                                        <input type="checkbox" name="mantenimiento" value="Revisión general" checked={(vehiculoSeleccionado.mantenimiento || []).includes('Revisión general')} onChange={handleDetalleChange} style={{ width: '18px', height: '18px' }} />
                                        Revisión general (frenos, fluidos)
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                        <input type="checkbox" name="mantenimiento" value="Ajustes" checked={(vehiculoSeleccionado.mantenimiento || []).includes('Ajustes')} onChange={handleDetalleChange} style={{ width: '18px', height: '18px' }} />
                                        Ajustes mecánicos y alineación
                                    </label>
                                </div>

                            </div>

                            {/* Columna Derecha - Histórico y Financiero */}
                            <div>
                                <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px', color: '#1e293b' }}>Historial e Información Fiscal</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem', color: '#475569' }}>Boletas de Reservas</label>
                                        <input type="number" name="historialReservas" value={vehiculoSeleccionado.historialReservas} onChange={handleDetalleChange} min="0" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem', color: '#475569' }}>Kilometraje (Km)</label>
                                        <input type="number" name="kilometraje" value={vehiculoSeleccionado.kilometraje} onChange={handleDetalleChange} min="0" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem', color: '#475569' }}>Valor Fiscal ($)</label>
                                        <input type="number" name="valorFiscal" value={vehiculoSeleccionado.valorFiscal} onChange={handleDetalleChange} min="0" step="0.01" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem', color: '#475569' }}>Depreciación (%)</label>
                                        <input type="number" name="depreciacion" value={vehiculoSeleccionado.depreciacion} onChange={handleDetalleChange} min="0" max="100" step="0.1" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                    </div>
                                </div>

                                {vehiculoSeleccionado.imagen && (
                                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                        <img src={vehiculoSeleccionado.imagen} alt="Vehículo" style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ padding: '20px 25px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '15px', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                            <button onClick={cerrarDetalle} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>Cerrar</button>
                            <button onClick={saveDetalles} style={{ padding: '10px 25px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 2px 4px rgba(16,185,129,0.3)' }}>Guardar Actualización</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default GestionVehiculos;
