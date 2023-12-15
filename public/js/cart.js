document.getElementById('contenido').addEventListener('click', async function (event) {

    if (event.target.id === 'subtract') {
        const productId = event.target.getAttribute('data-productid');
        const cartId = event.target.getAttribute('data-cartid');
        let quantity = event.target.getAttribute('current-quantity');
        if (quantity > 1) {
            quantity = parseInt(quantity) - 1;
            try {
                const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: quantity }),
                });

                location.reload(true)

            } catch (error) {
                console.error('Error al realizar la solicitud:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Hubo un error al eliminar el producto`,
                })
            }
        }
    }

    if (event.target.id === 'add') {
        const productId = event.target.getAttribute('data-productid');
        const cartId = event.target.getAttribute('data-cartid');
        let quantity = event.target.getAttribute('current-quantity');
        quantity = parseInt(quantity) + 1;
        try {
            const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: quantity }),
            });

            location.reload(true)

        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un error al agregar el producto`,
            })
        }
    }

    const deleteButton = event.target.closest('.btn-delete')
    if (deleteButton) {
        const productId = deleteButton.getAttribute('data-productid');
        const cartId = deleteButton.getAttribute('data-cartid');
        try {
            const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un error al agregar el producto`,
            })
        }
        location.reload(true)
    }
});


document.getElementById('purchase-button').addEventListener('click', async function (event) {
    const total = event.target.getAttribute('data-total');
    const cartId = event.target.getAttribute('data-cart');
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Quieres finalizar la compra?",
        html: `*Nota: Recuerde, si no hay algun producto en stock el mismo quedará en el carrito.<br>Total: <strong>U$D${total}</strong>`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Comprar",
        cancelButtonText: "No, seguir viendo productos",
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const purchaseResponse = await fetch(`http://localhost:8080/api/carts/cartId/purchase`)
            }
            catch (error) {
                swalWithBootstrapButtons.fire({
                    title: "Error!!!",
                    text: "No pudimos procesar la compra, intenta mas tarde o comunicate con nosotros por el chat",
                    icon: "error"
                });
            }
            swalWithBootstrapButtons.fire({
                title: "Compra finalizada!",
                text: "Te llegará un mail con el detalle de tu compra",
                icon: "success"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    location.reload(true)
                }
            })
        }
        else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
        }
    });
})