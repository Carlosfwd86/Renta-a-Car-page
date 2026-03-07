import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Vehiculos from '../pages/Vehiculos'
import Admin from '../pages/Admin/Admin'
import GestionVehiculos from '../pages/Admin/GestionVehiculos'

function Routing() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/vehiculos" element={<Vehiculos />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/vehiculos" element={<GestionVehiculos />} />
            </Routes>
        </Router>
    )
}

export default Routing