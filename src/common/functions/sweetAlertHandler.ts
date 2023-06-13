import Swal from 'sweetalert2';

export const useSweetAlert = (massage: string): void => {
  Swal.fire({
    icon: 'error',
    iconColor: '#da4c4c',
    showConfirmButton: false,
    showCloseButton: true,
    text: `Error: ${massage}!`,
  });
};
