import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsuarios, postUsuarios } from '../services/UsuariosService';
import './Auth.css';

/* =============================================
   Reglas de validación del formulario
============================================= */
function validarNombre(nombre) {
    if (/\s\s/.test(nombre)) return 'El nombre no puede tener espacios dobles.';
    if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
    if (/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(nombre)) return 'El nombre no puede contener números ni símbolos.';
    return null;
}

function validarEmail(email) {
    if (/\s/.test(email)) return 'El correo no puede contener espacios.';
    if (!email.includes('@')) return 'El correo debe contener @.';
    if (!email.toLowerCase().includes('.com')) return 'El correo debe contener .com';
    if (/[^a-zA-Z0-9@.\-_]/.test(email)) return 'El correo no puede contener símbolos especiales.';
    return null;
}

function validarPassword(password) {
    if (/\s/.test(password)) return 'La contraseña no puede contener espacios.';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (/[^a-zA-Z0-9]/.test(password)) return 'La contraseña no puede contener símbolos ni caracteres especiales.';
    return null;
}

function validarConfirmacion(password, confirmacion) {
    if (password !== confirmacion) return 'Las contraseñas no coinciden.';
    return null;
}

function Registro() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmacion: ''
    });
    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');
    const [exito, setExito] = useState(false);
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrores(prev => ({ ...prev, [name]: '' }));
        setErrorGeneral('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errNombre = validarNombre(form.nombre);
        const errEmail = validarEmail(form.email);
        const errPass = validarPassword(form.password);
        const errConf = validarConfirmacion(form.password, form.confirmacion);

        if (errNombre || errEmail || errPass || errConf) {
            setErrores({
                nombre: errNombre || '',
                email: errEmail || '',
                password: errPass || '',
                confirmacion: errConf || ''
            });
            return;
        }

        setCargando(true);
        try {
            // Verificar si el correo ya está registrado
            const usuarios = await getUsuarios();
            const existente = usuarios.find(u => u.email === form.email);
            if (existente) {
                setErrorGeneral('Este correo ya está registrado. Intenta iniciar sesión.');
                setCargando(false);
                return;
            }

            // Registrar el nuevo usuario
            const nuevoUsuario = {
                id: Date.now().toString(),
                nombre: form.nombre.trim(),
                email: form.email.trim(),
                password: form.password,
                rol: 'cliente'
            };

            await postUsuarios(nuevoUsuario);
            setExito(true);

            // Redirigir al login después de 2 segundos
            setTimeout(() => navigate('/login'), 2000);

        } catch {
            setErrorGeneral('Error de conexión. Verifica que el servidor esté activo.');
        } finally {
            setCargando(false);
        }
    };

    if (exito) {
        return (
            <div className="auth-page">
                <div className="auth-card auth-card--success">
                    <div className="auth-success-icon">✓</div>
                    <h2 className="auth-title">¡Registro exitoso!</h2>
                    <p className="auth-subtitle">Tu cuenta ha sido creada. Redirigiendo al inicio de sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <Link to="/" className="auth-logo-link">Renta<span>Ya</span></Link>
                </div>

                <h1 className="auth-title">Crear Cuenta</h1>
                <p className="auth-subtitle">Regístrate para acceder a todos nuestros vehículos.</p>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="nombre">Nombre completo</label>
                        <input
                            id="nombre"
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            className={`auth-input ${errores.nombre ? 'auth-input--error' : ''}`}
                            placeholder="Ej: Juan Pérez"
                            autoComplete="name"
                        />
                        {errores.nombre && <span className="auth-error-msg">{errores.nombre}</span>}
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="email">Correo electrónico</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className={`auth-input ${errores.email ? 'auth-input--error' : ''}`}
                            placeholder="ejemplo@correo.com"
                            autoComplete="email"
                        />
                        {errores.email && <span className="auth-error-msg">{errores.email}</span>}
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className={`auth-input ${errores.password ? 'auth-input--error' : ''}`}
                            placeholder="Mínimo 8 caracteres, sin símbolos"
                            autoComplete="new-password"
                        />
                        {errores.password && <span className="auth-error-msg">{errores.password}</span>}
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="confirmacion">Confirmar contraseña</label>
                        <input
                            id="confirmacion"
                            type="password"
                            name="confirmacion"
                            value={form.confirmacion}
                            onChange={handleChange}
                            className={`auth-input ${errores.confirmacion ? 'auth-input--error' : ''}`}
                            placeholder="Repite tu contraseña"
                            autoComplete="new-password"
                        />
                        {errores.confirmacion && <span className="auth-error-msg">{errores.confirmacion}</span>}
                    </div>

                    <div className="auth-rules">
                        <p className="auth-rules-title">Requisitos de contraseña:</p>
                        <ul className="auth-rules-list">
                            <li className={form.password.length >= 8 ? 'rule--ok' : ''}>Mínimo 8 caracteres</li>
                            <li className={!/\s/.test(form.password) && form.password.length > 0 ? 'rule--ok' : ''}>Sin espacios en blanco</li>
                            <li className={/^[a-zA-Z0-9]*$/.test(form.password) && form.password.length > 0 ? 'rule--ok' : ''}>Sin símbolos ni caracteres especiales</li>
                        </ul>
                    </div>

                    {errorGeneral && (
                        <div className="auth-error-general">{errorGeneral}</div>
                    )}

                    <button type="submit" className="auth-btn" disabled={cargando}>
                        {cargando ? 'Registrando...' : 'Crear cuenta'}
                    </button>
                </form>

                <div className="auth-footer-text">
                    ¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia sesión</Link>
                </div>
            </div>
        </div>
    );
}

export default Registro;
