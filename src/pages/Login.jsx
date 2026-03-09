import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { getUsuarios } from '../services/UsuariosService';
import './Auth.css';

/* =============================================
   Reglas de validación del formulario
============================================= */
function validarEmail(email) {
    // Sin espacios, debe contener @ y .com, sin caracteres especiales raros
    if (/\s/.test(email)) return 'El correo no puede contener espacios.';
    if (!email.includes('@')) return 'El correo debe contener @.';
    if (!email.toLowerCase().includes('.com')) return 'El correo debe contener .com';
    // Solo letras, números, @, punto y guión
    if (/[^a-zA-Z0-9@.\-_]/.test(email)) return 'El correo no puede contener símbolos especiales.';
    return null;
}

function validarPassword(password) {
    if (/\s/.test(password)) return 'La contraseña no puede contener espacios.';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (/[^a-zA-Z0-9]/.test(password)) return 'La contraseña no puede contener símbolos ni caracteres especiales.';
    return null;
}

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ email: '', password: '' });
    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Limpiar error del campo al escribir
        setErrores(prev => ({ ...prev, [name]: '' }));
        setErrorGeneral('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar campos
        const errEmail = validarEmail(form.email);
        const errPass = validarPassword(form.password);

        if (errEmail || errPass) {
            setErrores({ email: errEmail || '', password: errPass || '' });
            return;
        }

        setCargando(true);
        try {
            const usuarios = await getUsuarios();
            const encontrado = usuarios.find(
                u => u.email === form.email && u.password === form.password
            );

            if (!encontrado) {
                setErrorGeneral('Correo o contraseña incorrectos.');
                setCargando(false);
                return;
            }

            login(encontrado);

            // Redirigir según rol
            if (encontrado.rol === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch {
            setErrorGeneral('Error de conexión. Verifica que el servidor esté activo.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <Link to="/" className="auth-logo-link">Renta<span>Ya</span></Link>
                </div>

                <h1 className="auth-title">Iniciar Sesión</h1>
                <p className="auth-subtitle">Bienvenido de nuevo. Ingresa tus credenciales.</p>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
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
                            placeholder="Mínimo 8 caracteres"
                            autoComplete="current-password"
                        />
                        {errores.password && <span className="auth-error-msg">{errores.password}</span>}
                    </div>

                    {errorGeneral && (
                        <div className="auth-error-general">{errorGeneral}</div>
                    )}

                    <button type="submit" className="auth-btn" disabled={cargando}>
                        {cargando ? 'Verificando...' : 'Ingresar'}
                    </button>
                </form>

                <div className="auth-footer-text">
                    ¿No tienes cuenta? <Link to="/registro" className="auth-link">Regístrate aquí</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
