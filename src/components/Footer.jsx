import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp, FaTwitter } from 'react-icons/fa';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-brand">
                    <h2>Renta <span>Ya</span></h2>
                    <p>Liderando la movilidad premium en Costa Rica con la flota más moderna y el mejor servicio al cliente.</p>
                </div>

                <div className="footer-links">
                    <h3>Explorar</h3>
                    <ul>
                        <li><NavLink to="/">Inicio</NavLink></li>
                        <li><NavLink to="/vehiculos">Vehículos</NavLink></li>
                        <li><NavLink to="/reservas">Reservas</NavLink></li>
                        <li><NavLink to="/nosotros">Nosotros</NavLink></li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h3>Soporte</h3>
                    <ul>
                        <li><NavLink to="/contacto">Contacto</NavLink></li>
                        <li><NavLink to="/atencion-cliente">Atención al Cliente</NavLink></li>
                        <li><a href="#">Términos y Condiciones</a></li>
                        <li><a href="#">Privacidad</a></li>
                    </ul>
                </div>

                <div className="footer-social">
                    <h3>Síguenos</h3>
                    <div className="footer-social-icons">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://wa.me/50688889999" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
                        <a href="https://www.x.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 RentaYA — Todos los derechos reservados. Diseñado para la excelencia.</p>
            </div>
        </footer>
    );
}

export default Footer;