import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import revision2 from '../imgs/revision2.png';
import { FaCarSide, FaLeaf, FaStar, FaTractor, FaTruckPickup, FaCar } from 'react-icons/fa';
import './Vehiculos.css';

function Vehiculos() {
    const categorias = [
        { nombre: 'Económicos', icono: <FaCar /> },
        { nombre: 'Compactos', icono: <FaCarSide /> },
        { nombre: 'SUV', icono: <FaTractor /> },
        { nombre: 'Camionetas', icono: <FaTruckPickup /> },
        { nombre: 'Lujo', icono: <FaStar /> },
        { nombre: 'Híbridos', icono: <FaLeaf /> }
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