import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import revision2 from '../imgs/revision2.png';
import { FaCarSide, FaLeaf, FaStar, FaTractor, FaTruckPickup, FaCar, FaVaadin, FaSearch, FaGasPump, FaUserFriends, FaCog, FaCompass } from 'react-icons/fa';
import { getVehiculos } from '../services/VehiculosService';
import './Vehiculos.css';

function Vehiculos() {
    const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pasajerosFilter, setPasajerosFilter] = useState('Todos');
    const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');

    useEffect(() => {
        const cargarVehiculos = async () => {
            const data = await getVehiculos();
            if (data) {
                // Filtrar solo los que estén disponibles según el administrador
                const disponibles = data.filter(v => v.disponible === true);
                setVehiculosDisponibles(disponibles);
            }
        };
        cargarVehiculos();
    }, []);

    const categorias = [
        { nombre: 'Económico', icono: <FaCar /> },
        { nombre: 'Compacto', icono: <FaCarSide /> },
        { nombre: 'SUV', icono: <FaTractor /> },
        { nombre: 'Camioneta', icono: <FaTruckPickup /> },
        { nombre: 'Lujo', icono: <FaStar /> },
        { nombre: 'Híbrido/Eléctrico', icono: <FaLeaf /> },
        { nombre: 'Van', icono: <FaVaadin /> },
    ];

    const scrollToCategory = (nombre) => {
        const el = document.getElementById(`categoria-${nombre}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Filter logic
    const vehiculosFiltrados = vehiculosDisponibles.filter(v => {
        const matchSearch = v.marca.toLowerCase().includes(searchTerm.toLowerCase()) || v.modelo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchPasajeros = pasajerosFilter === 'Todos' || String(v.pasajeros) === pasajerosFilter;

        const cats = Array.isArray(v.categoria) ? v.categoria : (v.categoria ? [v.categoria] : []);
        const matchCat = categoriaFiltro === 'Todos' || cats.includes(categoriaFiltro);
        return matchSearch && matchPasajeros && matchCat;
    });

    const renderVehiculoCard = (vehiculo) => (
        <div key={vehiculo.id} className="carrusel-card">
            <div className="carrusel-img-wrapper">
                {vehiculo.imagen ? (
                    <img src={vehiculo.imagen} alt={`${vehiculo.marca} ${vehiculo.modelo}`} className="carrusel-img" />
                ) : (
                    <div className="carrusel-img-placeholder">
                        <FaCar className="placeholder-icon" />
                        <span>Imagen no disponible</span>
                    </div>
                )}
                <div className="carrusel-price-badge">
                    <span>${vehiculo.precioDia}</span>/día
                </div>
            </div>

            <div className="carrusel-content">
                <div className="carrusel-header-info">
                    <h3>{vehiculo.marca} <span>{vehiculo.modelo}</span></h3>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px' }}>
                        {(Array.isArray(vehiculo.categoria) ? vehiculo.categoria : (vehiculo.categoria ? [vehiculo.categoria] : [])).map((c, i) => (
                            <span key={i} className="categoria-badge" style={(c === 'Híbrido/Eléctrico' || vehiculo.combustible === 'Eléctrico') ? { backgroundColor: '#dcfce7', color: '#166534', fontWeight: 'bold' } : {}}>
                                {c}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="carrusel-features" style={{ flexWrap: 'wrap', rowGap: '12px' }}>
                    <div className="feature"><FaUserFriends /> {vehiculo.pasajeros || '5'} pas.</div>
                    <div className="feature"><FaCog /> {vehiculo.transmision || 'Auto'}</div>
                    <div className="feature" style={((Array.isArray(vehiculo.categoria) ? vehiculo.categoria : [vehiculo.categoria]).includes('Híbrido/Eléctrico') || vehiculo.combustible === 'Eléctrico') ? { color: '#10b981', fontWeight: 'bold' } : {}}>
                        <FaGasPump /> {vehiculo.combustible || 'Gasolina'}
                    </div>
                    <div className="feature"><FaCompass /> {vehiculo.traccion || '4x2'}</div>
                </div>

                <button className="carrusel-btn">Reservar ahora</button>
            </div>
        </div>
    );

    return (
        <div className="vehiculos-page">
            <NavBar />

            <div className="vehiculos-hero" style={{ backgroundImage: `url(${revision2})` }}>
                <div className="vehiculos-hero-overlay">
                    <h1>Nuestros Vehículos</h1>
                    <p>Encuentra el auto ideal para tu próxima aventura</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar-container">
                <div className="filter-bar">
                    <div className="filter-left">
                        <div className="filter-tipo">
                            <span className="yellow-indicator"></span>
                            <span className="filter-label">Tipo:</span>
                            <div className="filter-pills">
                                <button className={`filter-pill ${categoriaFiltro === 'Todos' ? 'active-pill' : ''}`} onClick={() => setCategoriaFiltro('Todos')}>Todos</button>
                                {categorias.map(cat => (
                                    <button
                                        key={cat.nombre}
                                        className={`filter-pill ${categoriaFiltro === cat.nombre ? 'active-pill' : ''}`}
                                        onClick={() => setCategoriaFiltro(cat.nombre)}
                                    >
                                        {cat.nombre}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-pasajeros">
                            <span className="filter-label" style={{ marginLeft: '10px' }}>Pasajeros:</span>
                            <select className="filter-select" value={pasajerosFilter} onChange={(e) => setPasajerosFilter(e.target.value)}>
                                <option value="Todos">Todos</option>
                                <option value="2">2</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="15">15</option>
                            </select>
                        </div>
                    </div>

                    <div className="filter-right">
                        <div className="search-input-container">
                            <input
                                type="text"
                                placeholder="Buscar modelo o marca..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="search-icon" />
                        </div>
                    </div>
                </div>
            </div>


            {/* SECCIONES POR CATEGORÍA - Aquí se almacenan y muestran los vehículos ingresados por el admin */}
            <div className="vehiculos-por-categoria-container" style={{ padding: '0 20px 60px' }}>
                {vehiculosFiltrados.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                        <h3>No se encontraron vehículos disponibles con los filtros actuales.</h3>
                        <button className="action-btn" onClick={() => { setCategoriaFiltro('Todos'); setSearchTerm(''); setPasajerosFilter('Todos'); }} style={{ marginTop: '20px' }}>Limpiar filtros</button>
                    </div>
                ) : (
                    categorias.map(cat => {
                        const vehiculosEnEstaCat = vehiculosFiltrados.filter(v => {
                            const cats = Array.isArray(v.categoria) ? v.categoria : (v.categoria ? [v.categoria] : []);
                            return cats.includes(cat.nombre);
                        });

                        // Solo renderizar la sección si la categoría tiene vehículos
                        if (vehiculosEnEstaCat.length === 0) return null;

                        return (
                            <section key={cat.nombre} id={`categoria-${cat.nombre}`} className="carrusel-section" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
                                <div className="carrusel-header" style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '30px' }}>
                                    <div style={{ fontSize: '2.5rem', color: 'hsl(209, 69%, 10%)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e2e8f0', width: '60px', height: '60px', borderRadius: '12px' }}>
                                        {cat.icono}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{cat.nombre}</h2>
                                        <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '1rem' }}>{vehiculosEnEstaCat.length} modelos disponibles para reservar en esta categoría</p>
                                    </div>
                                </div>

                                <div className="carrusel-container">
                                    {vehiculosEnEstaCat.map(renderVehiculoCard)}
                                </div>
                            </section>
                        );
                    })
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Vehiculos;