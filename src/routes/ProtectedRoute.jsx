import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ================================================
   PROTECTED ROUTE – Protege rutas de administrador
   Redirige al login si no hay sesión de admin
================================================ */

function ProtectedRoute({ children }) {
    const { usuario, esAdmin } = useAuth();

    if (!usuario) {
        // No hay sesión → redirigir al login
        return <Navigate to="/login" replace />;
    }

    if (!esAdmin()) {
        // Hay sesión pero no es admin → redirigir al inicio
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
