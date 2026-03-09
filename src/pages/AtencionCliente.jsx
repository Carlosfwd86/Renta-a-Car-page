import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import './AtencionCliente.css';

function AtencionCliente() {
    return (
        <div className="atencion-page">
            <NavBar />

            {/* =====================================================
                HERO BANNER – ATENCIÓN AL CLIENTE
                ➡️  Cambia el src de la imagen aquí:
                    Archivo: src/pages/AtencionCliente.jsx  →  línea ~18
                    Coloca la URL entre las comillas del atributo src
            ===================================================== */}
            <header className="page-hero">
                <div className="page-hero__overlay"></div>
                {/* ⬅️ COLOCA AQUÍ LA URL DE TU IMAGEN en el atributo src */}
                <img
                    src="https://img.freepik.com/foto-gratis/pareja-hablando-concesionario-automoviles_23-2148384886.jpg?semt=ais_hybrid&w=740&q=80"
                    alt="Atención al cliente RentaYA"
                    className="page-hero__img"
                />
                <div className="page-hero__content">
                    <h1>Atención al <span>Cliente</span></h1>
                    <p>Estamos aquí para ayudarte en cada paso de tu viaje. Nuestro equipo disponible 24/7.</p>
                </div>
            </header>

            <main className="atencion-main">
                <section className="atencion-content">
                    <div className="atencion-card">
                        <h2>Soporte y Contacto</h2>
                        <p>Nuestro equipo está disponible 24/7 para resolver tus dudas sobre depósitos de garantía, pagos flexibles y asistencia técnica.</p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default AtencionCliente;

