import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

function Admin() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <NavBar />

            <main style={{ flexGrow: 1, padding: '40px' }}>
                <h1 style={{ color: 'hsl(209, 69%, 10%)', marginBottom: '20px' }}>Panel Administrativo</h1>
                <p>Bienvenido al dashboard de administración.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>

                    <Link to="/admin/vehiculos" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer', height: '100%', transition: 'transform 0.2s, boxShadow 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)' }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <h3>Gestión de Vehículos 🚗</h3>
                            <p>Añade, edita (PATCH) o elimina vehículos bajo el estándar CRUD completo.</p>
                        </div>
                    </Link>

                    {/* Tarjetas de ejemplo que luego se conectarán con DB */}
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h3>Gestión de Reservas 📅</h3>
                        <p>Revisa y administra las reservas activas.</p>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h3>Gestión de Pagos 💳</h3>
                        <p>Revisa el historial de transacciones.</p>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h3>Gestión de Usuarios 🧑‍💼</h3>
                        <p>Administra clientes y roles.</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Admin;
