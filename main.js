let servicios = [
    { nombre: "Mindfulness", descripcion: "Atención Plena con interés, curiosidad y aceptación.", precio: 50 },
    { nombre: "Terapia ACT", descripcion: "Modelo de psicoterapia respaldado científicamente.", precio: 80 },
    { nombre: "Terapia EMDR", descripcion: "Método de psicoterapia para traumas y salud mental.", precio: 100 },
    { nombre: "Psicología", descripcion: "Estudio de la mente y el comportamiento.", precio: 70 },
    { nombre: "Hipnoterapia", descripcion: "Herramienta poderosa para mejorar el bienestar.", precio: 90 },
    { nombre: "Psicoterapia", descripcion: "Tratamiento basado en el diálogo.", precio: 60 },
];

let carrito = [];

// DOM Elements
const servicesContainer = document.getElementById("servicesContainer");
const cartTableBody = document.querySelector("#cartTable tbody");
const totalAmount = document.getElementById("totalAmount");
const checkoutButton = document.getElementById("checkoutButton");

// Cargar servicios desde un archivo JSON o usar los predefinidos
async function cargarServicios() {
    try {
        const response = await fetch("services.json");
        if (!response.ok) throw new Error("No se pudo cargar el archivo JSON.");
        servicios = await response.json();
    } catch (error) {
        console.warn("Usando lista de servicios predefinida:", error);
    } finally {
        generarServicios();
    }
}

// Generar servicios en la interfaz
function generarServicios() {
    servicesContainer.innerHTML = "";
    servicios.forEach((servicio, index) => {
        const card = document.createElement("div");
        card.className = "service-card";
        card.innerHTML = `
            <h3>${servicio.nombre}</h3>
            <p>${servicio.descripcion}</p>
            <p><strong>Precio:</strong> S/ ${servicio.precio}</p>
            <button onclick="agregarAlCarrito(${index})">Agregar</button>
        `;
        servicesContainer.appendChild(card);
    });
}

// Agregar al carrito
function agregarAlCarrito(index) {
    const servicio = servicios[index];
    const item = carrito.find((item) => item.nombre === servicio.nombre);

    if (item) {
        item.cantidad++;
    } else {
        carrito.push({ ...servicio, cantidad: 1 });
    }

    actualizarCarrito();
}

// Actualizar carrito
function actualizarCarrito() {
    cartTableBody.innerHTML = "";
    if (carrito.length === 0) {
        cartTableBody.innerHTML = `<tr id="emptyCartRow"><td colspan="5">Tu carrito está vacío.</td></tr>`;
        checkoutButton.disabled = true;
        totalAmount.textContent = "0.00";
    } else {
        carrito.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.nombre}</td>
                <td>S/ ${item.precio}</td>
                <td>
                    <button onclick="cambiarCantidad(${index}, -1)">-</button>
                    ${item.cantidad}
                    <button onclick="cambiarCantidad(${index}, 1)">+</button>
                </td>
                <td>S/ ${(item.precio * item.cantidad).toFixed(2)}</td>
                <td><button onclick="eliminarDelCarrito(${index})">Eliminar</button></td>
            `;
            cartTableBody.appendChild(row);
        });

        const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        totalAmount.textContent = total.toFixed(2);
        checkoutButton.disabled = false;
    }
}

// Cambiar cantidad de un servicio en el carrito
function cambiarCantidad(index, delta) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) eliminarDelCarrito(index);
    else actualizarCarrito();
}

// Eliminar un servicio del carrito con confirmación
function eliminarDelCarrito(index) {
    const servicioEliminado = carrito[index].nombre;

    Swal.fire({
        title: "¿Eliminar servicio?",
        text: `¿Seguro que quieres eliminar "${servicioEliminado}" del carrito?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.splice(index, 1);
            actualizarCarrito();
            Swal.fire({
                title: "Eliminado",
                text: `"${servicioEliminado}" ha sido eliminado del carrito.`,
                icon: "success"
            });
        }
    });
}

// Finalizar compra con validación
checkoutButton.addEventListener("click", () => {
    if (carrito.length === 0) {
        Swal.fire({
            title: "Carrito vacío",
            text: "Agrega al menos un servicio antes de pagar.",
            icon: "warning"
        });
        return;
    }

    Swal.fire({
        title: "Compra realizada",
        text: `Total: S/ ${totalAmount.textContent}`,
        icon: "success"
    });

    carrito = [];
    actualizarCarrito();
});

// Iniciar carga de servicios
cargarServicios();