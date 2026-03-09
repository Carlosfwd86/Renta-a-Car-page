import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import {
    FaPhoneAlt, FaEnvelope, FaMapMarkerAlt,
    FaFacebookSquare, FaInstagram, FaWhatsapp,
    FaRobot, FaPaperPlane, FaTimes
} from 'react-icons/fa';
import { swalOk } from '../utils/swal';
import './Contacto.css';

function Contacto() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
    });

    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { type: 'bot', text: '¡Hola! Soy RentaBot. ¿En qué puedo ayudarte hoy?\n\n1. Consultar requisitos\n2. Métodos de pago\n3. Soporte técnico' }
    ]);
    const [userInput, setUserInput] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await swalOk('✅ Mensaje enviado', 'Nos pondremos en contacto contigo a la brevedad.');
        setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const newMessages = [...chatMessages, { type: 'user', text: userInput }];

        // Simulación de lógica de bot
        let botResponse = '';
        const lowerInput = userInput.trim().toLowerCase();

        if (lowerInput === '1') {
            botResponse = 'Para alquilar necesitas: 1. Cédula vigente, 2. Licencia de conducir al día, 3. Tarjeta de crédito para el depósito.';
        } else if (lowerInput === '2') {
            botResponse = 'Aceptamos transferencias bancarias, SINPE Móvil y las principales tarjetas de crédito (Visa, Mastercard, Amex).';
        } else if (lowerInput === '3') {
            botResponse = 'Para soporte urgente, llámanos al +506 8000-RENT o escribe a soporte@rentaya.com.';
        } else {
            botResponse = 'Lo siento, no entiendo esa opción. Por favor marca 1, 2 o 3.\n\n1. Requisitos\n2. Pagos\n3. Soporte';
        }

        setTimeout(() => {
            setChatMessages([...newMessages, { type: 'bot', text: botResponse }]);
        }, 600);

        setChatMessages(newMessages);
        setUserInput('');
    };

    return (
        <div className="contacto-page">
            <NavBar />

            <header className="contacto-hero">
                <div className="hero-overlay"></div>
                {/* =====================================================
                    HERO BANNER – CONTACTO
                    ➡️  Cambia el src de la imagen aquí:
                         Archivo: src/pages/Contacto.jsx  →  línea ~73
                         Coloca la URL entre las comillas del atributo src
                ===================================================== */}
                <img
                    src="https://edicion.parentesis.com/imagesPosts/entrega_1.jpg"
                    alt="Soporte y Contacto"
                    className="hero-img"
                />
                <div className="hero-content">
                    <h1>Soporte & <span>Conexión</span></h1>
                    <p>Estamos aquí para escucharte y resolver tus dudas en tiempo récord. Tu viaje comienza con una conversación.</p>
                </div>
            </header>

            <main className="contacto-container">
                <div className="contacto-grid">
                    {/* INFORMACIÓN DE CONTACTO */}
                    <div className="contacto-info-cards">
                        <section className="info-section">
                            <div className="section-tag">Canales Directos</div>
                            <h2>Encuéntranos en <span>Costa Rica</span></h2>

                            <div className="info-item">
                                <div className="info-icon"><FaPhoneAlt /></div>
                                <div className="info-text">
                                    <label>Teléfono Central</label>
                                    <span>+506 2222-0000</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon"><FaWhatsapp /></div>
                                <div className="info-text">
                                    <label>WhatsApp Móvil</label>
                                    <span>+506 8888-9999</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon"><FaEnvelope /></div>
                                <div className="info-text">
                                    <label>Correo Electrónico</label>
                                    <span>info@rentaya.com</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon"><FaMapMarkerAlt /></div>
                                <div className="info-text">
                                    <label>Ubicación Principal</label>
                                    <span>San José, Paseo Colón, Edificio Renta Ya.</span>
                                </div>
                            </div>
                        </section>

                        <section className="social-section">
                            <h3>Síguenos en nuestras redes</h3>
                            <div className="social-links">
                                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-link fb"><FaFacebookSquare /> Facebook</a>
                                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-link ig"><FaInstagram /> Instagram</a>
                                <a href="https://wa.me/50688889999" target="_blank" rel="noopener noreferrer" className="social-link wa"><FaWhatsapp /> WhatsApp</a>
                            </div>
                        </section>
                    </div>

                    {/* FORMULARIO DE CONTACTO */}
                    <div className="contacto-form-card">
                        <div className="form-inner">
                            <h3>Envíanos un <span>Mensaje</span></h3>
                            <form onSubmit={handleFormSubmit}>
                                <div className="form-group">
                                    <label>Nombre Completo</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Correo Electrónico</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="juan@ejemplo.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Asunto</label>
                                    <input
                                        type="text"
                                        name="asunto"
                                        value={formData.asunto}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Ej. Consulta sobre XL-7"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mensaje</label>
                                    <textarea
                                        name="mensaje"
                                        value={formData.mensaje}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Escribe aquí tu consulta detallada..."
                                        rows="5"
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn-send-message">
                                    Enviar Mensaje <FaPaperPlane />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* CHATBOT SIMULATION */}
            <div className={`chatbot-wrapper ${chatOpen ? 'open' : ''}`}>
                {!chatOpen ? (
                    <button className="chatbot-bubble" onClick={() => setChatOpen(true)}>
                        <FaRobot />
                        <span className="bubble-notif">1</span>
                    </button>
                ) : (
                    <div className="chatbot-window">
                        <div className="chat-header">
                            <div className="chat-title">
                                <FaRobot />
                                <span>RentaBot</span>
                            </div>
                            <button className="chat-close" onClick={() => setChatOpen(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="chat-body">
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`chat-msg ${msg.type}`}>
                                    <div className="msg-content">{msg.text}</div>
                                </div>
                            ))}
                        </div>
                        <form className="chat-footer" onSubmit={handleChatSubmit}>
                            <input
                                type="text"
                                placeholder="Escribe 1, 2 o 3..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                            />
                            <button type="submit"><FaPaperPlane /></button>
                        </form>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Contacto;
