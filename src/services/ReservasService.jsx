//GET RESERVAS funcion que consulta al endpoint a traves de un fetch,conuslta al API al Endpoint
async function getReservas() {
    try {
        const respuestaServidor = await fetch("http://localhost:3001/reservas")
        const datosReservas = await respuestaServidor.json();
        return datosReservas;
    } catch (error) {
        console.error("Error al obtener las reservas", error);
    }
}
export { getReservas }

//POST RESERVAS AQUI SE VA A CREAR LA FUNCION PARA GUARDAR UNA NUEVA RESERVA
async function postReservas(reserva) {
    try {
        const respuesta = await fetch("http://localhost:3001/reservas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reserva)
        })
        const datosReservas = await respuesta.json();
        return datosReservas;
    } catch (error) {
        console.error("Error al obtener las reservas", error);
    }
}
export { postReservas }

//PATCH
async function patchReservas(reserva, id) {
    try {
        const respuesta = await fetch("http://localhost:3001/reservas/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reserva)
        })
        const datosReservas = await respuesta.json();
        return datosReservas;
    } catch (error) {
        console.error("Error al actualizar los cambios", error);
    }
}
export { patchReservas }

//DELETE
async function deleteReservas(id) {
    try {
        const respuesta = await fetch("http://localhost:3001/reservas/" + id, {
            method: "DELETE",
        })
        const datosReservas = await respuesta.json();
        return datosReservas;
    } catch (error) {
        console.error("Error al Eliminar el registro", error);
    }
}
export { deleteReservas }
