const URL_NOTIFICACIONES = "http://localhost:3001/notificaciones";

/* ===================================================
   NOTIFICACIONES SERVICE – Simulación de Avisos por Correo
   Registra alertas en db.json para que el admin las vea
=================================================== */

export const getNotificaciones = async () => {
    try {
        const response = await fetch(URL_NOTIFICACIONES);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener notificaciones:", error);
    }
};

export const postNotificacion = async (notificacion) => {
    try {
        // Simulamos el envío de correo registrando la alerta
        const response = await fetch(URL_NOTIFICACIONES, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...notificacion,
                fecha: new Date().toISOString(),
                leida: false,
                emailDestino: "cjimenez@rentaya.com" // Admin oficial
            })
        });

        console.log("NOTIFICACIÓN SIMULADA: Se ha enviado un aviso a cjimenez@rentaya.com");
        return await response.json();
    } catch (error) {
        console.error("Error al registrar notificación:", error);
    }
};

export const markAsRead = async (id) => {
    try {
        await fetch(`${URL_NOTIFICACIONES}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leida: true })
        });
    } catch (error) {
        console.error("Error al marcar como leída:", error);
    }
};
