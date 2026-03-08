import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaUserCircle, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

function NavBar() {
    const { usuario, logout, esAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar-container">
            <div className="navbar-logo-menu">
                <NavLink to="/" className="navbar-logo">Renta Ya</NavLink>
                <div className="navbar-divider"></div>
                <ul className="navbar-menu">
                    <li><NavLink to="/" className="navbar-link" end>Inicio</NavLink></li>
                    <li><NavLink to="/vehiculos" className="navbar-link">Vehículos</NavLink></li>
                    <li><NavLink to="/reservas" className="navbar-link">Reservas</NavLink></li>
                    <li><NavLink to="/nosotros" className="navbar-link">Nosotros</NavLink></li>
                    <li><NavLink to="/contacto" className="navbar-link">Contacto</NavLink></li>
                    <li><NavLink to="/atencion-cliente" className="navbar-link">Atención al Cliente</NavLink></li>

                    {esAdmin() && (
                        <li><NavLink to="/admin" className="navbar-link navbar-link--admin">Admin</NavLink></li>
                    )}
                </ul>
            </div>

            <div className="navbar-actions">
                <div className="navbar-socials">
                    <a href="#" aria-label="Facebook"><FaFacebook /></a>
                    <a href="#" aria-label="Instagram"><FaInstagram /></a>
                </div>

                {usuario ? (
                    <div className="navbar-user">
                        <div className="navbar-user-info">
                            <FaUserCircle className="navbar-user-icon" />
                            <span className="navbar-user-nombre">{usuario.nombre.split(' ')[0]}</span>
                        </div>
                        <button className="navbar-btn navbar-btn--logout" onClick={handleLogout} title="Cerrar sesión">
                            <FaSignOutAlt /> Salir
                        </button>
                    </div>
                ) : (
                    <div className="navbar-auth-btns">
                        <NavLink to="/login" className="navbar-btn navbar-btn--outline">
                            <FaSignInAlt /> Ingresar
                        </NavLink>
                        <NavLink to="/registro" className="navbar-btn">
                            Registrarse
                        </NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default NavBar;