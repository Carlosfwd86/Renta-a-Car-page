import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import revision2 from '../imgs/revision2.png';
import { FaCarSide, FaLeaf, FaStar, FaTractor, FaTruckPickup, FaCar, FaVaadin, FaSearch, FaGasPump, FaUserFriends, FaCog, FaCompass } from 'react-icons/fa';
import { getVehiculos } from '../services/VehiculosService';
import './Vehiculos.css';

function Vehiculos() {
    const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);

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
                                <button className="filter-pill">Económico</button>
                                <button className="filter-pill">Compacto</button>
                                <button className="filter-pill">SUV</button>
                                <button className="filter-pill">Camioneta</button>
                                <button className="filter-pill">Lujo</button>
                                <button className="filter-pill">Híbrido/Eléctrico</button>
                                <button className="filter-pill">Van</button>
                            </div>
                        </div>

                        <div className="filter-pasajeros">
                            <span className="filter-label" style={{ marginLeft: '10px' }}>Pasajeros:</span>
                            <select className="filter-select">
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
                            <input type="text" placeholder="Buscar" className="search-input" />
                            <FaSearch className="search-icon" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Carrusel de Vehículos Disponibles */}
            {vehiculosDisponibles.length > 0 && (
                <section className="carrusel-section">
                    <div className="carrusel-header">
                        <h2>Disponibles para ti</h2>
                        <p>Los mejores autos listos para rentar hoy mismo.</p>
                    </div>

                    <div className="carrusel-container">
                        {vehiculosDisponibles.map(vehiculo => (
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
                                        <span className="categoria-badge" style={(vehiculo.categoria === 'Híbridos' || vehiculo.combustible === 'Eléctrico') ? { backgroundColor: '#dcfce7', color: '#166534', fontWeight: 'bold' } : {}}>
                                            {vehiculo.categoria}
                                        </span>
                                    </div>

                                    <div className="carrusel-features" style={{ flexWrap: 'wrap', rowGap: '8px' }}>
                                        <div className="feature"><FaUserFriends /> {vehiculo.pasajeros || '5'}</div>
                                        <div className="feature"><FaCog /> {vehiculo.transmision || 'Automática'}</div>
                                        <div className="feature" style={(vehiculo.categoria === 'Híbridos' || vehiculo.combustible === 'Eléctrico') ? { color: '#10b981', fontWeight: 'bold' } : {}}>
                                            <FaGasPump /> {vehiculo.combustible || 'Gasolina'}
                                        </div>
                                        <div className="feature"><FaCompass /> {vehiculo.traccion || '4x2'}</div>
                                    </div>

                                    <button className="carrusel-btn">Reservar ahora</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="categorias-section">
                <h2 className="section-title">Elige tu categoría preferida</h2>
                <div className="categorias-grid">
                    {categorias.map((cat, index) => (
                        <div key={index} className="categoria-card">
                            <div className="cat-icon">{cat.icono}</div>
                            <h3>{cat.nombre}</h3>
                            <button className="action-btn">Ver modelos</button>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Vehiculos;