let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

function cargarProductosCarrito() {
    actualizarNumerito();
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach((producto) => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                        <img class="carrito-producto-imagen" src="${
                            "." + producto.imagen
                        }" alt="${producto.titulo}">
                        <div class="carrito-producto-titulo">
                            <small>Título</small>
                            <h3>${producto.nombre}</h3>
                        </div>
                        <div class="carrito-producto-cantidad">
                            <small>Cantidad</small>
                            <p>${producto.cantidad}</p>
                        </div>
                        <div class="carrito-producto-precio">
                            <small>Precio</small>
                            <p>$${producto.precio}</p>
                        </div>
                        <div class="carrito-producto-subtotal">
                            <small>Subtotal</small>
                            <p>$${producto.precio * producto.cantidad}</p>
                        </div>
                        <button class="carrito-producto-eliminar" id="${
                            producto.id
                        }"><i class="bi bi-trash-fill"></i></button>
                    `;

            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}
cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}
function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem",
        },
        offset: {
            x: "1.5rem",
            y: "1.5rem",
        },
        onClick: function () {},
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(
        (producto) => producto.id === idBoton
    );

    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem(
        "productos-en-carrito",
        JSON.stringify(productosEnCarrito)
    );
}

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    Swal.fire({
        title: "¿Estás seguro?",
        icon: "question",
        html: `Se van a borrar ${productosEnCarrito.reduce(
            (acc, producto) => acc + producto.cantidad,
            0
        )} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem(
                "productos-en-carrito",
                JSON.stringify(productosEnCarrito)
            );

            cargarProductosCarrito();
        }
    });
    let monedaActual = "ARS"
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce(
        (acc, producto) => acc + producto.precio * producto.cantidad,
        0
    );
    total.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
    agregar("Historial_Ventas", productosEnCarrito);
    productosEnCarrito.length = 0;
    localStorage.setItem(
        "productos-en-carrito",
        JSON.stringify(productosEnCarrito)
    );
    actualizarNumerito();
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce(
      (acc, producto) => acc + producto.cantidad,
      0
    );
    numerito.innerText = nuevoNumerito;
  }
  const getTasaDeCambio = () => {
    return fetch("https://api.exchangerate.host/latest?base=ARS&symbols=USD")
    .then(response => response.json())
    .then(data => {
        return data.rates.USD;
})
}

const calcularTotalCompra = () => {
    let total = 0
    productosEnCarrito.forEach(async (producto) => {
        //Obtengo el precio actual en pesos argentinos
        let precioActual = producto.precio * producto.cantidad;
        if (monedaActual === "USD") {
            //Obtengo la tasa de cambio USD/ARS mediante una API

                    //Obtengo la tasa de cambio USD/ARS
                    let tasaCambio = await getTasaDeCambio();
                    //Multiplico el precio en pesos por la tasa de cambio para obtener el precio en dolares
                    precioActual = precioActual * tasaCambio;
                    //Actualizo el total con el precio en dolares
                    total += precioActual;
                    //Actualizo el valor en la pagina con el simbolo de dolares
                    if (carrito.length === 0) {
                        totalCompra.innerHTML = "$ 0"
                    } else {
                        totalCompra.innerHTML = "US$ " + total.toFixed(2)
                    }
                ;
        } else {
            total += precioActual
            if (productosEnCarrito.length === 0) {
                totalCompra.innerHTML = "$ 0"
            } else {
                totalCompra.innerHTML = "$ " + total;
            }
        }
    })
    if (productosEnCarrito.length === 0) {
        totalCompra.innerHTML = "$ 0"
    }
    else if (monedaActual === "USD") {
        totalCompra.innerHTML = "US$ " + total.toFixed(2);
    } else {
        totalCompra.innerHTML = "$ " + total
    }
}


cambiarPrecio.addEventListener('click', () => {
    if (monedaActual === "ARS") {
        monedaActual = "USD"
    } else {
        monedaActual = "ARS"
    }
    calcularTotalCompra()
})