// ================================
// FUNCIONES DE INICIO
// ================================

// Obtener el sueldo guardado
function obtenerSueldo() {
    return Number(localStorage.getItem("sueldo")) || 0;
}

// Obtener los gastos guardados
function obtenerGastos() {
    return JSON.parse(localStorage.getItem("gastos") || "[]");
}

// Calcular el total de gastos
function totalGastos() {
    const gastos = obtenerGastos();

    return gastos.reduce(function(total, gasto) {
        return total + Number(gasto.monto);
    }, 0);
}

// Guardar el sueldo
function guardarSueldo() {
    const input = document.getElementById("sueldo");
    const sueldo = Number(input.value);

    if (sueldo < 0 || isNaN(sueldo)) {
        alert("Ingresa un sueldo válido.");
        return;
    }

    localStorage.setItem("sueldo", sueldo);

    actualizarInicio();
}

// Actualizar los datos de la página de inicio
function actualizarInicio() {
    const sueldo = obtenerSueldo();
    const gastos = totalGastos();
    const saldo = sueldo - gastos;

    document.getElementById("mostrarsueldo").textContent =
        sueldo.toFixed(2);

    document.getElementById("mostrargastos").textContent =
        gastos.toFixed(2);

    document.getElementById("saldo").textContent =
        saldo.toFixed(2);
}

// Guardar meta de ahorro
function guardarMeta() {
    const meta = document.getElementById("metaAhorro").value;

    localStorage.setItem("metaAhorro", meta);
}

// Cargar meta guardada
function cargarMeta() {
    const meta = localStorage.getItem("metaAhorro") || "";

    document.getElementById("metaAhorro").value = meta;
}

// Iniciar página
function iniciarInicio() {
    cargarMeta();
    actualizarInicio();

    document
        .getElementById("btnguardarsueldo")
        .addEventListener("click", guardarSueldo);

    document
        .getElementById("metaAhorro")
        .addEventListener("change", guardarMeta);
}

document.addEventListener("DOMContentLoaded", iniciarInicio);