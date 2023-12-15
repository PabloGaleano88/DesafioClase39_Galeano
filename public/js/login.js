document.addEventListener("DOMContentLoaded", function () {
    const sessionRadio = document.getElementById("session-radio");
    const jwtRadio = document.getElementById("jwt-radio");
    const loginForm = document.getElementById("log_in_form");

    sessionRadio.addEventListener("change", updateFormAction);
    jwtRadio.addEventListener("change", updateFormAction);

    function updateFormAction() {
        if (sessionRadio.checked) {
            loginForm.action = sessionRadio.value;

        } else if (jwtRadio.checked) {
            loginForm.action = jwtRadio.value;
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const forgotPasswordLink = document.getElementById('forgot-password');
    let email = ''
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function (event) {
            event.preventDefault();

            Swal.fire({
                title: 'Recuperar contraseña',
                html: '<p>Te enviaremos un mail para que puedas cambiar tu contraseña</p> <input type="email" id="swal-input1" class="swal2-input" placeholder="Ingrese su correo electrónico">',
                showCancelButton: true,
                confirmButtonText: 'Enviar',
                cancelButtonText: 'Cancelar',
                showLoaderOnConfirm: true,
                preConfirm: function () {
                    email = document.getElementById('swal-input1').value;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        Swal.showValidationMessage('Por favor, ingrese un correo electrónico válido');
                        return false;
                    }
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then( async (result) => {
                if (result.isConfirmed) {
                    try {
                        await fetch('http://localhost:8080/api/passresetreq', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({email}),
                        });

                        Swal.fire('Correo electrónico enviado', `Si la casilla de correo proporcionada existe, en los próximos minutos te llegará un mail a: ${result.value}`, 'success');
                    } catch (error) {
                        console.log(error);
                        Swal.fire({
                            title: 'Error!!!',
                            text: 'No pudimos enviar el mail, por favor, intenta de nuevo mas tarde',
                            icon: 'error',
                        });
                    }
                }
            });
        });
    }
});