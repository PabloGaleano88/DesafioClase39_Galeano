const socket = io()

const contenido = document.getElementById('contenido')

socket.on('actualizar_realtimeproducts', (content) => {
    let htmlcontent = ''
    content.map(element => {
        htmlcontent += `
            <div class="card" style="width: 18rem;">
                <div class="image-container">
                    <img src="${element.thumbnail}" class="card-img-top" alt="...">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${element.title} </h5>
                    <h6>U$D: ${element.price}</h6>
                    <p class="card-text">${element.description}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Stock: ${element.stock}</li>
                    <li class="list-group-item">Category: ${element.category}</li>
                    <li class="list-group-item">Code: ${element.code}</li>
                    <li class="list-group-item">Status: ${element.status}</li>
                    <li class="list-group-item">ID : ${element._id}</li>
                    <li class="list-group-item">${element.thumbnail}</li>
                </ul>
            </div>`
    });
    contenido.innerHTML = htmlcontent
})

document.getElementById("add_product").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", event.target.elements.title.value);
    formData.append("price", event.target.elements.price.value);
    formData.append("code", event.target.elements.code.value);
    formData.append("category", event.target.elements.category.value);
    formData.append("stock", event.target.elements.stock.value);
    formData.append("description", event.target.elements.description.value);

    const fileInput = document.querySelector('input[type="file"]');
    formData.append("file", fileInput.files[0]);
    try {
        const response = await fetch("/api/products", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Producto Agregado',
                text: `El producto ha sido agregado al carrito exitosamente.\n CartId:${cartId}`,
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al agregar el producto al carrito.',
            });
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Hubo un error al agregar el producto al carrito.${cartId}`,
        })
    }
    event.target.reset();
    
});



document.getElementById("del_product").addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const idToDelete = formData.get("id");
    fetch(`/api/products/${idToDelete}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                logger.info("Producto eliminado con éxito");

            } else {
                logger.warn("Error al eliminar el producto");
            }
        })
        .catch(error => {
            logger.error("Error en la solicitud:", error);
        });
    event.target.reset();
});