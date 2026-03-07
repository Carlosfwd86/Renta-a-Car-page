import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import './NavBar.css';

function NavBar() {
    return (
        <nav className="navbar-container">
            <div className="navbar-logo-menu">
                <NavLink to="/" className="navbar-logo">Renta Ya</NavLink>
                <div className="navbar-divider"></div>
                <ul className="navbar-menu">
                    <li><NavLink to="/" className="navbar-link">Inicio</NavLink></li>
                    <li><NavLink to="/vehiculos" className="navbar-link">Vehículos</NavLink></li>
                    <li><NavLink to="/nosotros" className="navbar-link">Nosotros</NavLink></li>
                    <li><NavLink to="/contacto" className="navbar-link">Contacto</NavLink></li>
                    <li><NavLink to="/admin" className="navbar-link" style={{ color: '#ffb703', fontWeight: 'bold' }}>Admin</NavLink></li>
                </ul>
            </div>

            <div className="navbar-actions">
                <div className="navbar-socials">
                    <a href="#" aria-label="Facebook"><FaFacebook /></a>
                    <a href="#" aria-label="Instagram"><FaInstagram /></a>
                </div>
                <button className="navbar-btn">Reserva ahora</button>
            </div>
        </nav>
    );
}

export default NavBar;