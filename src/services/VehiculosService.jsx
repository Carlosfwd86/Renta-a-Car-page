//GET VEHICULOS funcion que consulta al endpoint a traves de un fetch,conuslta al API al Endpoint
async function getVehiculos() {
    try {
        const respuestaServidor = await fetch("http://localhost:3001/vehiculos")
        const datosVehiculos = await respuestaServidor.json();
        return datosVehiculos;
    } catch (error) {
        console.error("Error al obtener los vehiculos", error);
    }
}
export { getVehiculos }

//POST VEHICULOS AQUI SE VA A CREAR LA FUNCION PARA GUARDAR UN NUEVO VEHICULO
async function postVehiculos(vehiculo) {
    try {
        const respuesta = await fetch("http://localhost:3001/vehiculos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(vehiculo)
        })
        const datosVehiculos = await respuesta.json();
        return datosVehiculos;
    } catch (error) {
        console.error("Error al obtener los vehiculos", error);
    }
}
export { postVehiculos }

//PATCH
async function patchVehiculos(vehiculo, id) {
    try {
        const respuesta = await fetch("http://localhost:3001/vehiculos/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(vehiculo)
        })
        const datosVehiculos = await respuesta.json();
        return datosVehiculos;
    } catch (error) {
        console.error("Error al actualizar los cambios", error);
    }
}
export { patchVehiculos }

//DELETE
async function deleteVehiculos(id) {
    try {
        const respuesta = await fetch("http://localhost:3001/vehiculos/" + id, {
            method: "DELETE",
        })
        const datosVehiculos = await respuesta.json();
        return datosVehiculos;
    } catch (error) {
        console.error("Error al Eliminar el registro", error);
    }
}
export { deleteVehiculos }
