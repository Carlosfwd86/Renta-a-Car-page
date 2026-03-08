import React, { createContext, useContext, useState, useEffect } from 'react';

/* ===================================================
   AUTH CONTEXT – Manejo global de sesión de usuario
   Almacena el usuario logueado en sessionStorage
=================================================== */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        // Recuperar sesión activa si el usuario ya estaba logueado
        const guardado = sessionStorage.getItem('rentaya_usuario');
        return guardado ? JSON.parse(guardado) : null;
    });

    const login = (datosUsuario) => {
        // Guardar en estado y en sessionStorage (se borra al cerrar pestaña)
        const sesion = {
            id: datosUsuario.id,
            nombre: datosUsuario.nombre,
            email: datosUsuario.email,
            rol: datosUsuario.rol
        };
        sessionStorage.setItem('rentaya_usuario', JSON.stringify(sesion));
        setUsuario(sesion);
    };

    const logout = () => {
        sessionStorage.removeItem('rentaya_usuario');
        setUsuario(null);
    };

    const esAdmin = () => usuario?.rol === 'admin';
    const estaLogueado = () => usuario !== null;

    return (
        <AuthContext.Provider value={{ usuario, login, logout, esAdmin, estaLogueado }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para acceder al contexto fácilmente
export function useAuth() {
    return useContext(AuthContext);
}

export default AuthContext;
