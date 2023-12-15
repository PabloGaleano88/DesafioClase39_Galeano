const socket = io()

let usuario = ''

Swal.fire({
    title: "Ingrese su correo",
    input: "text",
    confirmButtonText: "Ingresar"
}).then((inputdata) => {
    usuario = inputdata.value
})

const textbox = document.getElementById('textbox')
const contenido = document.getElementById('contenidoMensajes')

textbox.addEventListener('change', (e) => {
    if(e.target.value) {
        socket.emit('mensaje', {
            user: usuario,
            message: e.target.value,
        })
        e.target.value= ''
    }
})

socket.on('new_message', (data) => {
    const mensaje = data.map(({ user, message }) => {
        return `<p>${user} dijo: ${message}</p>`
    })
    contenido.innerHTML = mensaje.join('')
}) 