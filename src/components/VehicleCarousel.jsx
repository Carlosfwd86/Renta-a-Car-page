import React, { useState, useEffect, useRef } from 'react';
import { getVehiculos } from '../services/VehiculosService';
import { FaChevronLeft, FaChevronRight, FaUserFriends, FaCog, FaGasPump, FaCompass, FaCar } from 'react-icons/fa';
import './VehicleCarousel.css';

/* ===================================================
   VEHICLE CAROUSEL – Carrusel Dinámico de Inicio
   Desplazamiento automático cada 10 segundos
=================================================== */

function VehicleCarousel({ tipo = 'completo', onSelectVehicle }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [indiceActual, setIndiceActual] = useState(0);
    const [cargando, setCargando] = useState(true);
    const [itemsPerView, setItemsPerView] = useState(1);
    const timeoutRef = useRef(null);

    // Ajustar items per view según el tipo y resolución
    useEffect(() => {
        const updateItems = () => {
            if (tipo === 'compacto') {
                if (window.innerWidth > 1400) setItemsPerView(4);
                else if (window.innerWidth > 1100) setItemsPerView(3);
                else if (window.innerWidth > 768) setItemsPerView(2);
                else setItemsPerView(1);
            } else {
                setItemsPerView(1);
            }
        };
        updateItems();
        window.addEventListener('resize', updateItems);
        return () => window.removeEventListener('resize', updateItems);
    }, [tipo]);

    // Cargar datos
    useEffect(() => {
        const fetchVehiculos = async () => {
            const data = await getVehiculos();
            if (data) {
                // Filtrar solo disponibles y que no estén rentados
                const disponibles = data.filter(v => v.disponible === true && v.estadoVehiculo !== 'Rentado');
                setVehiculos(disponibles);
            }
            setCargando(false);
        };
        fetchVehiculos();
    }, []);

    // Lógica de auto-scroll (5 segundos)
    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        if (vehiculos.length > 0) {
            timeoutRef.current = setTimeout(
                () => setIndiceActual((prevIndice) =>
                    (prevIndice + itemsPerView >= vehiculos.length) ? 0 : prevIndice + 1
                ),
                5000
            );
        }
        return () => resetTimeout();
    }, [indiceActual, vehiculos.length, itemsPerView]);

    // Navegación manual
    const anterior = () => {
        setIndiceActual(prev => prev === 0 ? Math.max(0, vehiculos.length - itemsPerView) : prev - 1);
    };

    const siguiente = () => {
        setIndiceActual(prev => (prev + itemsPerView >= vehiculos.length) ? 0 : prev + 1);
    };

    if (cargando) return <div className="carousel-loading">Cargando flota...</div>;
    if (vehiculos.length === 0) return null;

    return (
        <section className={`home-carousel-section ${tipo === 'compacto' ? 'carousel-compact' : ''}`}>
            {tipo !== 'compacto' && (
                <div className="carousel-view-header">
                    <h2 className="carousel-view-title">Vehículos <span>Disponibles</span></h2>
                </div>
            )}

            <div className="carousel-relative-container">
                <button onClick={anterior} className="carousel-arrow carousel-arrow--left" aria-label="Anterior">
                    <FaChevronLeft />
                </button>

                <div className="carousel-slider-container">
                    <div
                        className="carousel-track"
                        style={{ transform: `translateX(-${indiceActual * (100 / itemsPerView)}%)` }}
                    >
                        {vehiculos.map((v) => (
                            <div key={v.id} className="carousel-slide" style={{ flex: `0 0 ${100 / itemsPerView}%` }}>
                                <div className="v-card" onClick={() => tipo === 'compacto' && onSelectVehicle && onSelectVehicle(v)}>
                                    {/* Imagen */}
                                    <div className="v-card-img-container">
                                        {v.imagen ? (
                                            <img src={v.imagen} alt={`${v.marca} ${v.modelo}`} className="v-card-img" />
                                        ) : (
                                            <div className="v-card-img-placeholder">
                                                <FaCar />
                                            </div>
                                        )}
                                        {tipo !== 'compacto' && (
                                            <div className="v-card-price-badge">
                                                <span className="price-val">${v.precioDia}</span>
                                                <span className="price-unit">/día</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="v-card-info">
                                        <div className="v-card-header">
                                            <span className="v-card-tag">Destacado</span>
                                            <h3 className="v-card-brand">{v.marca} {v.modelo}</h3>
                                            <p className="v-card-specs-line">{v.combustible} • {v.transmision} • {v.traccion}</p>
                                        </div>

                                        {tipo !== 'compacto' && (
                                            <>
                                                <div className="v-card-categories">
                                                    {(Array.isArray(v.categoria) ? v.categoria : [v.categoria]).map((cat, i) => (
                                                        <span key={i} className={`v-cat-pill ${cat === 'Híbrido/Eléctrico' || v.combustible === 'Eléctrico' ? 'v-cat-pill--eco' : ''}`}>
                                                            {cat}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="v-card-features">
                                                    <div className="v-feature">
                                                        <FaUserFriends />
                                                        <div className="v-feature-text">
                                                            <small>Pasajeros</small>
                                                            <span>{v.pasajeros || '5'} Adultos</span>
                                                        </div>
                                                    </div>
                                                    <div className="v-feature">
                                                        <FaCog />
                                                        <div className="v-feature-text">
                                                            <small>Transmisión</small>
                                                            <span>{v.transmision || 'Automática'}</span>
                                                        </div>
                                                    </div>
                                                    <div className={`v-feature ${v.combustible === 'Eléctrico' ? 'v-feature--eco' : ''}`}>
                                                        <FaGasPump />
                                                        <div className="v-feature-text">
                                                            <small>Combustión</small>
                                                            <span>{v.combustible || 'Gasolina'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="v-feature">
                                                        <FaCompass />
                                                        <div className="v-feature-text">
                                                            <small>Tracción</small>
                                                            <span>{v.traccion || '4x2'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    className="v-card-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSelectVehicle && onSelectVehicle(v);
                                                    }}
                                                >
                                                    Reservar ahora
                                                </button>
                                            </>
                                        )}

                                        {tipo === 'compacto' && (
                                            <div className="v-card-compact-footer">
                                                <span className="compact-price">${v.precioDia}/día</span>
                                                <button className="v-compact-btn">Ver</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button onClick={siguiente} className="carousel-arrow carousel-arrow--right" aria-label="Siguiente">
                    <FaChevronRight />
                </button>
            </div>

            {/* Indicadores de paginación o dots (Opcional en compacto) */}
            {tipo !== 'compacto' && (
                <div className="carousel-dots">
                    {vehiculos.map((_, i) => (
                        <button
                            key={i}
                            className={`carousel-dot ${i === indiceActual ? 'active' : ''}`}
                            onClick={() => setIndiceActual(i)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default VehicleCarousel;
