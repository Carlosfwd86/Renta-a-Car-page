import React, { useState, useEffect } from 'react';
import { swalWarning, swalError } from '../utils/swal';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { getVehiculos, patchVehiculos as updateVehiculo } from '../services/VehiculosService';
import { postNotificacion } from '../services/NotificacionesService';
import { postReservas } from '../services/ReservasService';
import { postPagos } from '../services/PagosService';
import VehicleCarousel from '../components/VehicleCarousel';
import { FaCalendarAlt, FaCreditCard, FaCheckCircle, FaExclamationTriangle, FaCloudUploadAlt, FaCar } from 'react-icons/fa';
import './Reservas.css';

/* ===================================================
   RESERVAS – Pantalla de Proceso de Reserva
   Implementación del Diagrama de Flujo
=================================================== */

function Reservas() {
    // 1: Selección/Fechas, 2: Datos, 3: Pago/Comprobante, 4: Confirmación
    const [step, setStep] = useState(1);
    const [errorFecha, setErrorFecha] = useState("");
    const [vehiculos, setVehiculos] = useState([]);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Formulario de reserva (Agregamos hooks para manejar los valores)
    const [clientName, setClientName] = useState("");
    const [clientId, setClientId] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientEmailConfirm, setClientEmailConfirm] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientAddress, setClientAddress] = useState("");
    const [clientIdFile, setClientIdFile] = useState(null);

    // Configuración de Países y Formatos (Añadimos banderas emojis)
    const paisesData = [
        { nombre: "Costa Rica", codigo: "+506", bandera: "🇨🇷", formato: "####-####", placeholder: "8888-8888" },
        { nombre: "Panamá", codigo: "+507", bandera: "🇵🇦", formato: "####-####", placeholder: "6000-0000" },
        { nombre: "Guatemala", codigo: "+502", bandera: "🇬🇹", formato: "####-####", placeholder: "7000-0000" },
        { nombre: "Honduras", codigo: "+504", bandera: "🇭🇳", formato: "####-####", placeholder: "9000-0000" },
        { nombre: "Nicaragua", codigo: "+505", bandera: "🇳🇮", formato: "####-####", placeholder: "8000-0000" },
        { nombre: "El Salvador", codigo: "+503", bandera: "🇸🇻", formato: "####-####", placeholder: "7000-0000" },
        { nombre: "México", codigo: "+52", bandera: "🇲🇽", formato: "## #### ####", placeholder: "55 0000 0000" },
        { nombre: "Colombia", codigo: "+57", bandera: "🇨🇴", formato: "### ### ####", placeholder: "300 000 0000" },
        { nombre: "Chile", codigo: "+56", bandera: "🇨🇱", formato: "# #### ####", placeholder: "9 0000 0000" },
        { nombre: "Argentina", codigo: "+54", bandera: "🇦🇷", formato: "## ####-####", placeholder: "11 0000-0000" },
        { nombre: "Perú", codigo: "+51", bandera: "🇵🇪", formato: "### ### ###", placeholder: "900 000 000" },
        { nombre: "España", codigo: "+34", bandera: "🇪🇸", formato: "### ### ###", placeholder: "600 000 000" },
        { nombre: "Estados Unidos", codigo: "+1", bandera: "🇺🇸", formato: "(###) ###-####", placeholder: "(555) 000-0000" },
        { nombre: "Canadá", codigo: "+1 ", bandera: "🇨🇦", formato: "(###) ###-####", placeholder: "(555) 000-0000" },
    ];

    const [paisSeleccionado, setPaisSeleccionado] = useState(paisesData[0]);

    // Función para formatear según la máscara
    const formatPhoneNumber = (value, mask) => {
        if (!value) return "";
        let cleaned = value.replace(/\D/g, ""); // Solo números
        let formatted = "";
        let valIdx = 0;

        for (let i = 0; i < mask.length && valIdx < cleaned.length; i++) {
            if (mask[i] === "#") {
                formatted += cleaned[valIdx];
                valIdx++;
            } else {
                formatted += mask[i];
            }
        }
        return formatted;
    };

    const handlePhoneChange = (e) => {
        const rawValue = e.target.value;
        const formatted = formatPhoneNumber(rawValue, paisSeleccionado.formato);
        setClientPhone(`(${paisSeleccionado.codigo}) ${formatted}`);
    };

    const [datosReserva, setDatosReserva] = useState({
        fechaInicio: '',
        fechaFin: ''
    });

    const today = new Date().toISOString().split('T')[0];

    const handleFechaChange = (campo, valor) => {
        if (valor < today) {
            setErrorFecha("!Error al escoger los días¡");
            setTimeout(() => setErrorFecha(""), 3000);
            return;
        }

        let nuevosDatos = { ...datosReserva, [campo]: valor };

        // Lógica interactiva solicitada:
        // Si cambio la fecha de inicio, la fecha de fin debe ser como mínimo esa misma fecha
        if (campo === 'fechaInicio') {
            if (!datosReserva.fechaFin || datosReserva.fechaFin < valor) {
                nuevosDatos.fechaFin = valor;
            }
        }
        // Si cambio la fecha de fin, no puede ser menor a la de inicio
        else if (campo === 'fechaFin') {
            if (datosReserva.fechaInicio && valor < datosReserva.fechaInicio) {
                setErrorFecha("!Error: La entrega no puede ser antes de la recogida¡");
                setTimeout(() => setErrorFecha(""), 3000);
                return;
            }
        }

        setDatosReserva(nuevosDatos);
    };

    const [totalDias, setTotalDias] = useState(0);
    const [calculoPrecio, setCalculoPrecio] = useState({
        subtotal: 0,
        iva: 0,
        total: 0
    });

    // Lógica para pre-seleccionar vehículo por URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const vId = params.get('vId');
        if (vId && vehiculos.length > 0) {
            const found = vehiculos.find(v => v.id === vId);
            if (found) setVehiculoSeleccionado(found);
        }
    }, [vehiculos]);

    // Lógica de cálculo automático de días y precio (Incluyendo IVA 13%)
    useEffect(() => {
        if (datosReserva.fechaInicio && datosReserva.fechaFin) {
            const inicio = new Date(datosReserva.fechaInicio);
            const fin = new Date(datosReserva.fechaFin);
            const diferencia = fin.getTime() - inicio.getTime();
            const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

            if (dias > 0) {
                setTotalDias(dias);
                if (vehiculoSeleccionado) {
                    const sub = dias * vehiculoSeleccionado.precioDia;
                    const tax = sub * 0.13; // IVA 13% Costa Rica
                    setCalculoPrecio({
                        subtotal: sub,
                        iva: tax,
                        total: sub + tax
                    });
                }
            } else {
                setTotalDias(0);
                setCalculoPrecio({ subtotal: 0, iva: 0, total: 0 });
            }
        }
    }, [datosReserva.fechaInicio, datosReserva.fechaFin, vehiculoSeleccionado]);

    // Formulario de Pago
    const [pago, setPago] = useState({
        metodo: 'Transferencia', // o 'SINPE'
        comprobante: null // Aquí iría el anexo del comprobante
    });

    useEffect(() => {
        fetchVehiculos();
    }, []);

    const fetchVehiculos = async () => {
        const data = await getVehiculos();
        const disponibles = data.filter(v => v.disponible === true && v.estadoVehiculo !== 'Rentado');
        setVehiculos(disponibles);
        setCargando(false);
    };

    const handleSiguiente = async () => {
        if (step === 1 && !vehiculoSeleccionado) {
            await swalWarning('Vehículo no seleccionado', 'Por favor, selecciona un vehículo para continuar.');
            return;
        }
        if (step === 2) {
            if (!clientName || !clientEmail || !clientEmailConfirm || !clientId || !clientPhone || !clientAddress || !clientIdFile) {
                await swalWarning('Campos incompletos', 'Por favor, completa todos los campos del formulario y adjunta tu identificación.');
                return;
            }
            if (clientEmail !== clientEmailConfirm) {
                await swalError('Correos no coinciden', 'Los correos electrónicos ingresados no coinciden. Por favor, verifícalos.');
                return;
            }
        }
        setStep(step + 1);
    };

    const handleAtras = () => setStep(step - 1);

    const handleConfirmarReserva = async () => {
        if (!vehiculoSeleccionado) return;

        // 1. REGISTRO DEL PAGO EN EL SISTEMA
        const nuevoPago = await postPagos({
            monto: calculoPrecio.total,
            subtotal: calculoPrecio.subtotal,
            iva: calculoPrecio.iva,
            metodo: pago.metodo,
            fecha: new Date().toISOString(),
            cliente: clientName
        });

        if (nuevoPago) {
            // 2. REGISTRO DE LA RESERVA
            const nuevaReserva = await postReservas({
                vehiculoId: vehiculoSeleccionado.id,
                vehiculoNombre: `${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo}`,
                cliente: {
                    nombre: clientName,
                    identificacion: clientId,
                    idAdjunto: clientIdFile ? clientIdFile.name : null,
                    email: clientEmail,
                    telefono: clientPhone,
                    direccion: clientAddress
                },
                fechas: datosReserva,
                totalDias: totalDias,
                totalPago: calculoPrecio.total,
                pagoId: nuevoPago.id,
                estado: 'Confirmada',
                fechaCreacion: new Date().toISOString()
            });

            if (nuevaReserva) {
                // 3. ACTUALIZACIÓN EN EL SISTEMA DE FLOTAS (Estado del vehículo)
                await updateVehiculo(vehiculoSeleccionado.id, {
                    disponible: false,
                    estadoVehiculo: 'Reservado',
                    historialReservas: (vehiculoSeleccionado.historialReservas || 0) + 1
                });

                // 4. NOTIFICACIÓN AL ADMINISTRADOR
                await postNotificacion({
                    tipo: "PAGO_RECIBIDO",
                    mensaje: `NUEVA RESERVA ($${calculoPrecio.total.toFixed(2)}): El cliente ${clientName} ha reservado un ${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo} por ${totalDias} días y adjuntó su comprobante de pago por ${pago.metodo}.`,
                });

                setStep(4); // Pantalla de Confirmación
            }
        }
    };

    // Renderizado del Stepper (Puntos del proceso)
    const renderStepper = () => (
        <div className="reservas-stepper">
            <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div> <span>Vehículo y Fecha</span>
            </div>
            <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div> <span>Tus Datos</span>
            </div>
            <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div> <span>Pago Seguro</span>
            </div>
            <div className={`step-item ${step >= 4 ? 'active' : ''}`}>
                <div className="step-number">4</div> <span>Confirmación</span>
            </div>
        </div>
    );

    return (
        <div className="reservas-page">
            <NavBar />

            {/* =====================================================
                HERO BANNER – RESERVAS
                ➡️  Cambia el src de la imagen aquí:
                     Archivo: src/pages/Reservas.jsx  →  línea ~272
                     Coloca la URL entre las comillas del atributo src
            ===================================================== */}
            <header className="page-hero">
                <div className="page-hero__overlay"></div>
                {/* ⬅️ COLOCA AQUÍ LA URL DE TU IMAGEN en el atributo src */}
                <img
                    src="https://www.shutterstock.com/image-photo/white-car-drive-on-mountain-600nw-2391802981.jpg"
                    alt="Reserva de vehículos"
                    className="page-hero__img"
                />
                <div className="page-hero__content">
                    <h1>Centro de <span>Reservas</span></h1>
                    <p>Selecciona el vehículo ideal para tu próximo viaje y resérvalo en segundos.</p>
                </div>
            </header>

            <main className="reservas-process-container">
                <header className="reservas-header">
                    <h1 className="reservas-title">Centro de <span>Reservas</span></h1>
                    <p className="reservas-subtitle">Selecciona el vehículo ideal para tu próximo viaje y resérvalo en segundos.</p>
                </header>

                <VehicleCarousel
                    tipo="compacto"
                    onSelectVehicle={(v) => {
                        setVehiculoSeleccionado(v);
                        setStep(1);
                        setShowModal(true);
                    }}
                />

                <section className="reservation-guide-section">
                    <div className="guide-safety-banner">
                        <FaCheckCircle className="safety-icon" />
                        <p>Para tu tranquilidad y seguridad, todo proceso de traspaso se gestiona directamente con nuestro equipo experto, sin complicaciones y con el respaldo que nos caracteriza.</p>
                    </div>

                    <div className="guide-content-grid">
                        <div className="guide-text-content">
                            <h2 className="guide-title">¿Cómo funciona tu <span>Reserva?</span></h2>

                            <div className="guide-steps">
                                <div className="guide-step">
                                    <div className="step-tag">01</div>
                                    <div className="step-info">
                                        <h3>Selección & Disponibilidad</h3>
                                        <p>Elige tu modelo favorito y las fechas del viaje. El sistema calculará el precio total incluyendo impuestos automáticamente.</p>
                                    </div>
                                </div>

                                <div className="guide-step">
                                    <div className="step-tag">02</div>
                                    <div className="step-info">
                                        <h3>Documentación Segura</h3>
                                        <p>Adjunta tu identificación directamente en el formulario. Encriptamos toda tu información para tu máxima seguridad.</p>
                                    </div>
                                </div>

                                <div className="guide-step">
                                    <div className="step-tag">03</div>
                                    <div className="step-info">
                                        <h3>Métodos de Pago Transparentes</h3>
                                        <p>Aceptamos Transferencias Bancarias y SINPE Móvil. Solo debes subir el comprobante y nuestro equipo validará el pago en minutos.</p>
                                    </div>
                                </div>

                                <div className="guide-step">
                                    <div className="step-tag">04</div>
                                    <div className="step-info">
                                        <h3>Entrega Personalizada</h3>
                                        <p>Una vez confirmado, coordinamos la entrega en nuestra sucursal o directamente en la ubicación que nos indiques.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="guide-visual-container">
                            <div className="guide-image-box animate-float">
                                <img
                                    src="https://garantiaglobal.com/hs-fs/hubfs/c%C3%B3mo%20elegir%20el%20seguro%20de%20garant%C3%ADa%20mec%C3%A1nica.jpg?width=352&name=c%C3%B3mo%20elegir%20el%20seguro%20de%20garant%C3%ADa%20mec%C3%A1nica.jpg"
                                    alt="Guía de Reserva Premium"
                                    className="guide-premium-image"
                                />
                                <div className="image-overlay-glow"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {showModal && (
                    <div className="reservas-modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="reservas-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close-btn" onClick={() => setShowModal(false)}>&times;</button>

                            {renderStepper()}

                            {/* PASO 1: VERIFICACIÓN DISPONIBILIDAD Y SELECCIÓN */}
                            {step === 1 && (
                                <div className="reservas-step-card-modal">
                                    <h2>1. Configura tu Alquiler</h2>
                                    <p className="selected-v-name">Vehículo: <strong>{vehiculoSeleccionado?.marca} {vehiculoSeleccionado?.modelo}</strong></p>

                                    <div className="reservas-form-grid">
                                        <div className="r-input-group">
                                            <label>Periodo de Alquiler</label>
                                            <div className={`date-picker-grid ${datosReserva.fechaInicio && datosReserva.fechaFin ? 'has-range' : ''}`}>
                                                <div className={`custom-date-field ${datosReserva.fechaInicio ? 'selected' : ''}`} onClick={(e) => e.currentTarget.querySelector('input').showPicker()}>
                                                    <FaCalendarAlt className="date-icon" />
                                                    <div className="date-text-container">
                                                        <span>Fecha de Recogida</span>
                                                        <input
                                                            type="date"
                                                            min={today}
                                                            value={datosReserva.fechaInicio}
                                                            onChange={(e) => handleFechaChange('fechaInicio', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className={`custom-date-field ${datosReserva.fechaFin ? 'selected' : ''}`} onClick={(e) => e.currentTarget.querySelector('input').showPicker()}>
                                                    <FaCalendarAlt className="date-icon" />
                                                    <div className="date-text-container">
                                                        <span>Fecha de Entrega</span>
                                                        <input
                                                            type="date"
                                                            min={datosReserva.fechaInicio || today}
                                                            value={datosReserva.fechaFin}
                                                            onChange={(e) => handleFechaChange('fechaFin', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {errorFecha && (
                                        <div className="reservas-floating-error">
                                            <FaExclamationTriangle />
                                            <span>{errorFecha}</span>
                                        </div>
                                    )}

                                    {totalDias > 0 && calculoPrecio.total > 0 && (
                                        <div className="reservas-price-summary">
                                            <div className="summary-details">
                                                <div className="summary-row">
                                                    <span>Duración:</span>
                                                    <strong>{totalDias} días</strong>
                                                </div>
                                                <div className="summary-row">
                                                    <span>Subtotal:</span>
                                                    <strong>${calculoPrecio.subtotal.toFixed(2)}</strong>
                                                </div>
                                                <div className="summary-row">
                                                    <span>IVA (13%):</span>
                                                    <strong>${calculoPrecio.iva.toFixed(2)}</strong>
                                                </div>
                                            </div>
                                            <div className="summary-total-box">
                                                <span>Precio Total Final:</span>
                                                <strong>${calculoPrecio.total.toFixed(2)} USD</strong>
                                            </div>
                                        </div>
                                    )}

                                    <div className="r-nav-btns">
                                        <button className="r-btn r-btn--next" onClick={handleSiguiente}>Continuar a tus Datos</button>
                                    </div>
                                </div>
                            )}

                            {/* PASO 2: FORMULARIO DE RESERVA */}
                            {step === 2 && (
                                <div className="reservas-step-card-modal">
                                    <h3 className="form-section-title">A. Identificación del Cliente</h3>
                                    <div className="reservas-form-grid">
                                        <div className="r-input-group">
                                            <label>Nombre Completo</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Juan Pérez"
                                                value={clientName}
                                                onChange={(e) => setClientName(e.target.value)}
                                            />
                                        </div>
                                        <div className="r-input-group">
                                            <label># Pasaporte o ID</label>
                                            <input
                                                type="text"
                                                placeholder="Cédula, DNI o Pasaporte"
                                                value={clientId}
                                                onChange={(e) => setClientId(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <h3 className="form-section-title" style={{ marginTop: '30px' }}>B. Información de Contacto</h3>
                                    <div className="reservas-form-grid">
                                        <div className="r-input-group">
                                            <label>E-mail (Correo Electrónico)</label>
                                            <input
                                                type="email"
                                                placeholder="ej: minombre@ejemplo.com"
                                                value={clientEmail}
                                                onChange={(e) => setClientEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="r-input-group">
                                            <label>Confirmar E-mail</label>
                                            <input
                                                type="email"
                                                placeholder="Repite tu correo"
                                                value={clientEmailConfirm}
                                                onChange={(e) => setClientEmailConfirm(e.target.value)}
                                            />
                                        </div>
                                        <div className="r-input-group">
                                            <label>Número de Teléfono</label>
                                            <div className="r-phone-input-wrapper">
                                                <select
                                                    className="r-country-select"
                                                    value={paisSeleccionado.codigo}
                                                    onChange={(e) => {
                                                        const found = paisesData.find(p => p.codigo === e.target.value);
                                                        setPaisSeleccionado(found);
                                                        setClientPhone("");
                                                    }}
                                                >
                                                    {paisesData.map(p => (
                                                        <option key={p.codigo} value={p.codigo}>
                                                            {p.bandera} {p.codigo}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="tel"
                                                    placeholder={paisSeleccionado.placeholder}
                                                    value={clientPhone.replace(`(${paisSeleccionado.codigo}) `, "")}
                                                    onChange={handlePhoneChange}
                                                    className="r-phone-field"
                                                />
                                            </div>
                                        </div>
                                        <div className="r-input-group">
                                            <label>Dirección de Entrega</label>
                                            <input
                                                type="text"
                                                placeholder="Ubicación exacta / Calle / Casa"
                                                value={clientAddress}
                                                onChange={(e) => setClientAddress(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <h3 className="form-section-title" style={{ marginTop: '30px' }}>C. Datos Adjuntos</h3>
                                    <div className="file-upload-section" onClick={() => document.getElementById('id-upload-input').click()} style={{ marginBottom: '20px' }}>
                                        <FaCloudUploadAlt style={{ fontSize: '3rem', color: '#10b981', marginBottom: '10px' }} />
                                        <h3>Fotografía Pasaporte o ID</h3>
                                        <p>{clientIdFile ? `Archivo seleccionado: ${clientIdFile.name}` : "Haz clic para subir una foto clara de tu identificación"}</p>
                                        <input
                                            id="id-upload-input"
                                            type="file"
                                            style={{ display: 'none' }}
                                            accept="image/*,.pdf"
                                            onChange={(e) => setClientIdFile(e.target.files[0])}
                                        />
                                        {clientIdFile && <span className="upload-success-badge" style={{ color: '#10b981', display: 'block', marginTop: '10px', fontWeight: 'bold' }}><FaCheckCircle /> ID Cargado</span>}
                                    </div>
                                    <div className="r-nav-btns">
                                        <button className="r-btn r-btn--prev" onClick={handleAtras}>Atrás</button>
                                        <button className="r-btn r-btn--next" onClick={handleSiguiente}>Mover al Pago</button>
                                    </div>
                                </div>
                            )}

                            {/* PASO 3: FORMULARIO DE PAGO Y ANEXO */}
                            {step === 3 && (
                                <div className="reservas-step-card-modal">
                                    <h2>3. Formulario de Pago</h2>
                                    <p>Elige tu método de pago y anexa tu comprobante de transacción bancaria.</p>

                                    <div className="payment-options">
                                        <div
                                            className={`payment-method-card ${pago.metodo === 'Transferencia' ? 'selected' : ''}`}
                                            onClick={() => setPago({ ...pago, metodo: 'Transferencia' })}
                                        >
                                            <h3>Transferencia Bancaria</h3>
                                            <p>Cuentas: BAC National / BNCR</p>
                                        </div>
                                        <div
                                            className={`payment-method-card ${pago.metodo === 'SINPE' ? 'selected' : ''}`}
                                            onClick={() => setPago({ ...pago, metodo: 'SINPE' })}
                                        >
                                            <h3>SINPE Móvil</h3>
                                            <p>Tel: 8000-0000 (Renta Ya S.A.)</p>
                                        </div>
                                    </div>

                                    <div className="file-upload-section">
                                        <FaCloudUploadAlt style={{ fontSize: '3rem', color: '#10b981', marginBottom: '10px' }} />
                                        <h3>Anexo de Comprobante</h3>
                                        <p>Sube la captura o documento PDF de tu transacción.</p>
                                        <button className="r-btn r-btn--prev" style={{ marginTop: '15px' }}>Seleccionar Archivo</button>
                                    </div>

                                    <div className="r-nav-btns">
                                        <button className="r-btn r-btn--prev" onClick={handleAtras}>Atras</button>
                                        <button className="r-btn r-btn--next" onClick={handleConfirmarReserva}>Confirmar Reserva</button>
                                    </div>
                                </div>
                            )}

                            {/* PASO 4: CONFIRMACIÓN Y REGISTRO */}
                            {step === 4 && (
                                <div className="reservas-step-card-modal" style={{ textAlign: 'center' }}>
                                    <FaCheckCircle style={{ fontSize: '5rem', color: '#10b981', marginBottom: '20px' }} />
                                    <h2 style={{ fontSize: '2.5rem' }}>¡Reserva Confirmada!</h2>
                                    <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginTop: '10px' }}>
                                        Tu solicitud ha sido registrada exitosamente en nuestro sistema de flotas.
                                        En breve te contactaremos para la entrega de tu **{vehiculoSeleccionado?.marca} {vehiculoSeleccionado?.modelo}**.
                                    </p>
                                    <button className="r-btn r-btn--next" style={{ marginTop: '40px' }} onClick={() => window.location.href = '/'}>
                                        Volver al Inicio
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Reservas;
