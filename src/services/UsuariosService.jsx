//GET USUARIOS funcion que consulta al endpoint a traves de un fetch,conuslta al API al Endpoint
async function getUsuarios() {
    try {
        const respuestaServidor = await fetch("http://localhost:3001/usuarios")
        const datosUsuarios = await respuestaServidor.json();
        return datosUsuarios;
    } catch (error) {
        console.error("Error al obtener los usuarios", error);
    }
}
export { getUsuarios }

//POST USUARIOS AQUI SE VA A CREAR LA FUNCION PARA GUARDAR UN NUEVO USUARIO
async function postUsuarios(usuario) {
    try {
        const respuesta = await fetch("http://localhost:3001/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        })
        const datosUsuarios = await respuesta.json();
        return datosUsuarios;
    } catch (error) {
        console.error("Error al obtener los usuarios", error);
    }
}
export { postUsuarios }

//PATCH
async function patchUsuarios(usuario, id) {
    try {
        const respuesta = await fetch("http://localhost:3001/usuarios/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        })
        const datosUsuarios = await respuesta.json();
        return datosUsuarios;
    } catch (error) {
        console.error("Error al actualizar los cambios", error);
    }
}
export { patchUsuarios }

//DELETE
async function deleteUsuarios(id) {
    try {
        const respuesta = await fetch("http://localhost:3001/usuarios/" + id, {
            method: "DELETE",
        })
        const datosUsuarios = await respuesta.json();
        return datosUsuarios;
    } catch (error) {
        console.error("Error al Eliminar el registro", error);
    }
}
export { deleteUsuarios }
