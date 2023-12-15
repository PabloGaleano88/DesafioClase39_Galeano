
document.getElementById('contenido').addEventListener('click', async function (event) {
    if (event.target.id === 'purchase') {
        const productId = event.target.getAttribute('data-productid');
        const cartId = event.target.getAttribute('data-cartid');
        try {
            const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const response_text = await response.text()
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
                    text: `Hubo un error al agregar el producto al carrito.\n${response_text}`,
                });
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un error al agregar el producto al carrito: ${cartId}`,
            })
        }
    }
});
