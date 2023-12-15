Swal.fire({
    icon: 'error',
    title: 'No pudimos Autenticarte',
    text: 'El usuario y/o contraseña no son correctos, por favor, revisa tus datos o registrate si no lo has hecho',
    footer: '<a href="http://localhost:8080/signup">Registrarme</a>'
}).then(() => {
    window.location.href = "http://localhost:8080/login"
})





