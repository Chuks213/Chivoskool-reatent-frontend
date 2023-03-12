import Swal from 'sweetalert2';

export const showAlert = (type, message) => {
    Swal.fire({
        title: type == "warning" ? "Wait!" : (type == "error" ? "Oops!!!" : "Great!!!"),
        text: message,
        icon: type,
        confirmButtonText: 'Alright',
        confirmButtonColor: '#007bff'
    });
}

export const showAlertWithCallBack = (type, message, callback) => {
    Swal.fire({
        title: type == "warning" ? "Wait!" : (type == "error" ? "Oops!!!" : "Great!!!"),
        text: message,
        icon: type,
        confirmButtonText: 'Alright',
        confirmButtonColor: '#007bff'
    }).then((result) => {
        callback();
    });
}

export const showConfirmAlertWithCallBack = (type, message, callback) => {
    Swal.fire({
        title: type == "warning" ? "Wait!" : (type == "error" ? "Oops!!!" : "Great!!!"),
        text: message,
        icon: type,
        confirmButtonText: 'Proceed',
        confirmButtonColor: '#007bff',
        showCancelButton: true,
        focusConfirm: false, 
        cancelButtonText: "Cancel"
    }).then((result) => {
        if(result.isConfirmed) callback();
    });
}