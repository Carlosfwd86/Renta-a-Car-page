/**
 * swal.js – Helper centralizado de SweetAlert2
 * Tema oscuro/esmeralda coherente con RentaYA
 */
import Swal from 'sweetalert2';

const BASE = {
    background: '#0f172a',
    color: '#e2e8f0',
    iconColor: '#10b981',
    confirmButtonColor: '#10b981',
    cancelButtonColor: 'transparent',
    customClass: {
        popup: 'swal-renta-popup',
        confirmButton: 'swal-renta-confirm',
        cancelButton: 'swal-renta-cancel',
        title: 'swal-renta-title',
        icon: 'swal-renta-icon',
    },
};

/** Alerta de ÉXITO */
export const swalOk = (title, text = '') =>
    Swal.fire({ ...BASE, icon: 'success', title, text, timer: 2500, showConfirmButton: false });

/** Alerta de ERROR */
export const swalError = (title, text = '') =>
    Swal.fire({ ...BASE, icon: 'error', title, text, confirmButtonText: 'Entendido' });

/** Alerta de ADVERTENCIA */
export const swalWarning = (title, text = '') =>
    Swal.fire({ ...BASE, icon: 'warning', title, text, confirmButtonText: 'Aceptar' });

/** Confirmación de ELIMINACIÓN */
export const swalConfirmDelete = (itemName = 'este registro') =>
    Swal.fire({
        ...BASE,
        icon: 'warning',
        title: '¿Eliminar?',
        html: `Esta acción es <strong>irreversible</strong>. Se eliminará <em>${itemName}</em> permanentemente.`,
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#ef4444',
        reverseButtons: true,
    });

/** Confirmación GENÉRICA */
export const swalConfirm = (title, text = '') =>
    Swal.fire({
        ...BASE,
        icon: 'question',
        title,
        text,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
    });
