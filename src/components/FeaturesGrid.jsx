import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturesGrid.css';

/* ===================================================
   FEATURES GRID – Sección de opciones debajo del carrusel
   Redirige a diversas secciones según los requisitos.
=================================================== */

function FeaturesGrid() {
    const features = [
        {
            id: 1,
            titulo: "Reserva en línea",
            descripcion: "Busca, selecciona y paga tu alquiler directamente desde tu dispositivo con confirmación inmediata.",
            link: "/reservas",
            img: new URL('../imgs/ReservaEnLinea.jpeg', import.meta.url).href
        },
        {
            id: 2,
            titulo: "Flotas modernas y confiable",
            descripcion: "Autos revisados y listos para rodar en las principales áreas turísticas de Costa Rica.",
            link: "/vehiculos",
            img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 3,
            titulo: "Atención local o destinos turísticos",
            descripcion: "Ubicados en los principales puntos turísticos. Recibe tu auto y comienza tu aventura sin complicaciones.",
            link: "/atencion-cliente",
            img: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 4,
            titulo: "Procesos de entrega",
            descripcion: "Inspección rápida, firma digital del contrato, y listo para partir en minutos.",
            link: "/reservas",
            img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 5,
            titulo: "Depósitos de garantía",
            descripcion: "Devolución completa del depósito tras inspección sin daños. Seguridad y claridad en cada alquiler.",
            link: "/atencion-cliente",
            img: new URL('../imgs/DepositoGarantia.jpeg', import.meta.url).href
        },
        {
            id: 6,
            titulo: "Pagos flexible",
            descripcion: "Múltiples opciones de pago y confirmación instantánea. Alquila con confianza.",
            link: "/atencion-cliente",
            img: new URL('../imgs/PagosFlexibles.jpeg', import.meta.url).href
        }
    ];

    return (
        <section className="features-grid-section">
            <div className="features-container">
                {features.map((feature) => (
                    <Link to={feature.link} key={feature.id} className="feature-card">
                        <div className="feature-img-wrapper">
                            <img src={feature.img} alt={feature.titulo} className="feature-img" />
                        </div>
                        <div className="feature-content">
                            <h3 className="feature-title">{feature.titulo}</h3>
                            <p className="feature-description">{feature.descripcion}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default FeaturesGrid;
