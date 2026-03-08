import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import './AtencionCliente.css';

function AtencionCliente() {
    return (
        <div className="atencion-page">
            <NavBar />
            <main className="atencion-main">
                <div className="atencion-hero">
                    <h1 className="atencion-title">Atención al Cliente</h1>
                    <p className="atencion-subtitle">Estamos aquí para ayudarte en cada paso de tu viaje.</p>
                </div>

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
