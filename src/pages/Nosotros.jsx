import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { FaHistory, FaGem, FaUsers, FaChartLine } from 'react-icons/fa';
import './Nosotros.css';

function Nosotros() {
    return (
        <div className="nosotros-page">
            <NavBar />

            <header className="nosotros-hero">
                <div className="hero-overlay"></div>
                {/* =====================================================
                    HERO BANNER – NOSOTROS
                    ➡️  Cambia el src de la imagen aquí:
                         Archivo: src/pages/Nosotros.jsx  →  línea ~16
                         Coloca la URL entre las comillas del atributo src
                ===================================================== */}
                <img
                    src="https://www.muchoneumatico.com/blog/wp-content/uploads/2024/04/Hombre-en-concessionario-comprando-un-coche-nuevo.jpg"
                    alt="Colección Premium"
                    className="hero-img"
                />
                <div className="hero-content">
                    <h1>Nuestra <span>Esencia</span></h1>
                    <p>Elevando el estándar del alquiler de vehículos con pasión y excelencia desde el primer kilómetro.</p>
                </div>
            </header>

            <main className="nosotros-container">
                {/* SECCIÓN HISTORIA */}
                <section className="nosotros-history">
                    <div className="history-text">
                        <div className="section-tag"><FaHistory /> Nuestra Trayectoria</div>
                        <h2>Una historia de <span>Movilidad</span> y Confianza</h2>
                        <p>
                            Renta Ya nació con una visión clara: transformar la experiencia de alquilar un vehículo en un proceso lleno de estilo, transparencia y servicio excepcional. Lo que comenzó como un pequeño parque automotriz se ha convertido en la flota más moderna y exclusiva de la región.
                        </p>
                        <p>
                            Creemos que cada viaje es una oportunidad para crear recuerdos, y nuestra misión es proporcionar el vehículo perfecto para cada una de esas historias.
                        </p>
                    </div>
                    <div className="history-stats">
                        <div className="stat-card">
                            <h3>10+</h3>
                            <span>Años de Experiencia</span>
                        </div>
                        <div className="stat-card">
                            <h3>500+</h3>
                            <span>Vehículos Propios</span>
                        </div>
                        <div className="stat-card">
                            <h3>15k+</h3>
                            <span>Usuarios Felices</span>
                        </div>
                    </div>
                </section>

                {/* SECCIÓN VALORES */}
                <section className="nosotros-values">
                    <h2 className="section-title">Pilares que nos <span>Definen</span></h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <FaGem className="value-icon" />
                            <h3>Excelencia Premium</h3>
                            <p>Mantenemos los más altos estándares de calidad y lujo en cada detalle de nuestra flota.</p>
                        </div>
                        <div className="value-card">
                            <FaUsers className="value-icon" />
                            <h3>Enfoque Humano</h3>
                            <p>Nuestros clientes no son números; son invitados especiales a los que brindamos atención personalizada.</p>
                        </div>
                        <div className="value-card">
                            <FaChartLine className="value-icon" />
                            <h3>Innovación Continua</h3>
                            <p>Adoptamos las últimas tecnologías para hacer que tu reserva sea tan fluida como el motor de nuestros autos.</p>
                        </div>
                    </div>
                </section>

                {/* SECCIÓN EQUIPO */}
                <section className="nosotros-team">
                    <div className="team-content-wrapper">
                        <div className="team-image-box">
                            <img
                                src="https://cdn.prod.website-files.com/62963c737eb54683862cc9a4/64c91c9a1b0426df3f4f62ad_shutterstock_2227097661.webp"
                                alt="Nuestro Equipo"
                                className="team-main-img"
                            />
                            <div className="image-accent-border"></div>
                        </div>
                        <div className="team-info">
                            <div className="section-tag">El Corazón de Renta Ya</div>
                            <h2>El equipo detrás de tu <span>Próximo Destino</span></h2>
                            <p>
                                Somos un grupo de expertos apasionados por el sector automotriz y el servicio al cliente. Desde mecánicos especializados hasta asesores de viaje, trabajamos en conjunto para asegurar que tu única preocupación sea disfrutar del camino.
                            </p>
                            <button className="btn-team-info">Conoce más</button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Nosotros;
