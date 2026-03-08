import React from 'react';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import VehicleCarousel from '../components/VehicleCarousel';
import FeaturesGrid from '../components/FeaturesGrid'; // Nuevo componente
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <NavBar />
      <Header />
      <main className="home-main-content">
        <VehicleCarousel
          onSelectVehicle={(v) => navigate(`/reservas?vId=${v.id}`)}
        />
        <FeaturesGrid />
      </main>
      <Footer />
    </div>
  );
}

export default Home;