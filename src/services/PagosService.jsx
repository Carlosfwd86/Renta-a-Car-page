//GET PAGOS funcion que consulta al endpoint a traves de un fetch,conuslta al API al Endpoint
async function getPagos() {
    try {
        const respuestaServidor = await fetch("http://localhost:3001/pagos")
        const datosPagos = await respuestaServidor.json();
        return datosPagos;
    } catch (error) {
        console.error("Error al obtener los pagos", error);
    }
}
export { getPagos }

//POST PAGOS AQUI SE VA A CREAR LA FUNCION PARA GUARDAR UN NUEVO PAGO
async function postPagos(pago) {
    try {
        const respuesta = await fetch("http://localhost:3001/pagos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pago)
        })
        const datosPagos = await respuesta.json();
        return datosPagos;
    } catch (error) {
        console.error("Error al obtener los pagos", error);
    }
}
export { postPagos }

//PATCH
async function patchPagos(pago, id) {
    try {
        const respuesta = await fetch("http://localhost:3001/pagos/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pago)
        })
        const datosPagos = await respuesta.json();
        return datosPagos;
    } catch (error) {
        console.error("Error al actualizar los cambios", error);
    }
}
export { patchPagos }

//DELETE
async function deletePagos(id) {
    try {
        const respuesta = await fetch("http://localhost:3001/pagos/" + id, {
            method: "DELETE",
        })
        const datosPagos = await respuesta.json();
        return datosPagos;
    } catch (error) {
        console.error("Error al Eliminar el registro", error);
    }
}
export { deletePagos }
