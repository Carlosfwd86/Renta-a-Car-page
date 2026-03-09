import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../services/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/Home';
import Vehiculos from '../pages/Vehiculos';
import Admin from '../pages/Admin/Admin';
import GestionVehiculos from '../pages/Admin/GestionVehiculos';
import GestionReservas from '../pages/Admin/GestionReservas';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import Reservas from '../pages/Reservas';
import AtencionCliente from '../pages/AtencionCliente';
import Nosotros from '../pages/Nosotros';
import Contacto from '../pages/Contacto';
import GestionPagos from '../pages/Admin/GestionPagos';
import GestionUsuarios from '../pages/Admin/GestionUsuarios';

function Routing() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={<Home />} />
                    <Route path="/vehiculos" element={<Vehiculos />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/reservas" element={<Reservas />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/atencion-cliente" element={<AtencionCliente />} />

                    {/* Rutas protegidas — solo admin */}
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/vehiculos" element={
                        <ProtectedRoute>
                            <GestionVehiculos />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/reservas" element={
                        <ProtectedRoute>
                            <GestionReservas />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/pagos" element={
                        <ProtectedRoute>
                            <GestionPagos />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/usuarios" element={
                        <ProtectedRoute>
                            <GestionUsuarios />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default Routing;