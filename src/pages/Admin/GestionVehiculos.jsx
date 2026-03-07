import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { getVehiculos, postVehiculos, patchVehiculos, deleteVehiculos } from '../../services/VehiculosService';

function GestionVehiculos() {
    const [vehiculos, setVehiculos] = useState([]);
    const [formData, setFormData] = useState({ id: '', marca: '', modelo: '', categoria: '', precioDia: '', disponible: true, imagen: '', combustible: '', transmision: '', pasajeros: '', traccion: '' });
    const [esEdicion, setEsEdicion] = useState(false);

    useEffect(() => {
        cargarVehiculos();
    }, []);

    const cargarVehiculos = async () => {
        const data = await getVehiculos();
        if (data) setVehiculos(data);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Formatear la subida final asegurando un número en precioDia
        let vehiculoFinal = {
            ...formData,
            precioDia: parseFloat(formData.precioDia || 0)
        };

        if (esEdicion) {
            // Actualizar vehículo existente con PATCH
            await patchVehiculos(vehiculoFinal, formData.id);
        } else {
            // Generar un ID único simple usando Date (para emular en base db.json, json-server igual genera ID pero se lo mandamos si queremos auto ID numérico)
            vehiculoFinal.id = Date.now().toString();
            await postVehiculos(vehiculoFinal);
        }

        // Limpiar el estado y reactualizar
        setFormData({ id: '', marca: '', modelo: '', categoria: '', precioDia: '', disponible: true, imagen: '', combustible: '', transmision: '', pasajeros: '', traccion: '' });
        setEsEdicion(false);
        cargarVehiculos();
    };

    const handleEdit = (vehiculo) => {
        setFormData(vehiculo);
        setEsEdicion(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este vehículo permanentemente?')) {
            await deleteVehiculos(id);
            cargarVehiculos();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <NavBar />

            <main style={{ flexGrow: 1, padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <h1 style={{ color: 'hsl(209, 69%, 10%)', marginBottom: '10px' }}>Gestión de Flotilla 🚗</h1>
                <p style={{ marginBottom: '30px', color: '#666' }}>Crea, lee, actualiza y elimina (CRUD) todos los vehículos de tu inventario.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>

                    {/* PANEL DE FORMULARIO (POST / PATCH) */}
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'sticky', top: '20px' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>
                            {esEdicion ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Marca</label>
                                <input type="text" name="marca" value={formData.marca} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} placeholder="Ej: Toyota" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Modelo</label>
                                <input type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} placeholder="Ej: Yaris 2023" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Categoría</label>
                                <select name="categoria" value={formData.categoria} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                    <option value="">Seleccione...</option>
                                    <option value="Económico">Económico</option>
                                    <option value="Compacto">Compacto</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Camioneta">Camioneta</option>
                                    <option value="Lujo">Lujo</option>
                                    <option value="Híbrido/Eléctrico">Híbrido/Eléctrico</option>
                                    <option value="Van">Van</option>
                                </select>
                            </div>
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
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Precio por Día ($)</label>
                                <input type="number" name="precioDia" value={formData.precioDia} onChange={handleInputChange} required min="1" step="0.01" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                                <input type="checkbox" name="disponible" checked={formData.disponible} onChange={handleInputChange} id="dispCheck" style={{ width: '18px', height: '18px' }} />
                                <label htmlFor="dispCheck" style={{ fontSize: '0.95rem', cursor: 'pointer' }}>Disponible para renta</label>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>URL de Imagen (Opcional)</label>
                                <input type="url" name="imagen" value={formData.imagen} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} placeholder="https://ejemplo.com/auto.jpg" />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: 'hsl(209, 69%, 10%)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'opacity 0.2s' }}>
                                    {esEdicion ? 'Guardar Cambios' : 'Anexar Vehículo'}
                                </button>
                                {esEdicion && (
                                    <button type="button" onClick={() => { setEsEdicion(false); setFormData({ id: '', marca: '', modelo: '', categoria: '', precioDia: '', disponible: true, imagen: '', combustible: '', transmision: '', pasajeros: '', traccion: '' }) }} style={{ flex: 1, padding: '12px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'background-color 0.2s' }}>
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* PANEL DE LISTADO (GET / DELETE) */}
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>
                            Directorio Vehicular ({vehiculos.length})
                        </h2>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                                        <th style={{ padding: '14px 12px', color: '#475569' }}>Vehículo (Marca/Modelo)</th>
                                        <th style={{ padding: '14px 12px', color: '#475569' }}>Categoría</th>
                                        <th style={{ padding: '14px 12px', color: '#475569' }}>Precio</th>
                                        <th style={{ padding: '14px 12px', color: '#475569' }}>Estado</th>
                                        <th style={{ padding: '14px 12px', color: '#475569', textAlign: 'center' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehiculos.map(v => (
                                        <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                                            <td style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {v.imagen && (
                                                    <img src={v.imagen} alt={v.modelo} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{v.marca}</div>
                                                    <div style={{ fontSize: '0.85em', color: '#64748b' }}>{v.modelo}</div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 12px' }}>
                                                <span style={{
                                                    backgroundColor: (v.categoria === 'Híbridos' || v.combustible === 'Eléctrico') ? '#dcfce7' : '#f1f5f9',
                                                    color: (v.categoria === 'Híbridos' || v.combustible === 'Eléctrico') ? '#166534' : '#475569',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.85em',
                                                    fontWeight: (v.categoria === 'Híbridos' || v.combustible === 'Eléctrico') ? 'bold' : 'normal'
                                                }}>{v.categoria}</span>
                                            </td>
                                            <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0f172a' }}>
                                                ${v.precioDia}<span style={{ fontSize: '0.8em', color: '#64748b', fontWeight: 'normal' }}>/día</span>
                                            </td>
                                            <td style={{ padding: '14px 12px' }}>
                                                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', backgroundColor: v.disponible ? '#dcfce7' : '#fee2e2', color: v.disponible ? '#166534' : '#991b1b', fontWeight: '500' }}>
                                                    {v.disponible ? 'Disponible' : 'Ocupado'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                                                <button onClick={() => handleEdit(v)} style={{ padding: '6px 12px', margin: '0 4px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Editar</button>
                                                <button onClick={() => handleDelete(v.id)} style={{ padding: '6px 12px', margin: '0 4px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Borrar</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {vehiculos.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                                                No hay vehículos registrados en la base de datos (db.json). Usa el formulario para agregar uno.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default GestionVehiculos;
