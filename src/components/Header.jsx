import React from 'react';
import './Header.css';
import AutoChica from '../imgs/AutoChica.png';
import { NavLink } from 'react-router-dom'

function Header() {
    return (
        <header className="header-container">
            <img
                src={AutoChica}
                alt="mujer rentando"
                className="header-image"
            />

            <div className="header-overlay">
                <div className="header-content">
                    <div className="header-subtitle">
                        <span className="subtitle-line"></span>
                        <p>Alquila fácil, maneja ya.</p>
                    </div>
                    <h1>Renta un auto en<br />Costa Rica en<br />minutos</h1>

                    <div className="header-buttons">
                        <button className="btn-primary">Ver disponibilidad</button>
                        <button className="btn-secondary">Llamar ahora</button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
