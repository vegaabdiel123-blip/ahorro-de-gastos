// ================================
// FUNCIONES DE PRESUPUESTO
// ================================

// Obtener sueldo
function obtenerSueldo() {
    return Number(localStorage.getItem("sueldo")) || 0;
}

// Mostrar sueldo disponible
function mostrarIngreso() {
    const sueldo = obtenerSueldo();

    document.getElementById("presupuestoIngreso").textContent =
        sueldo.toFixed(2);
}

// Calcular presupuesto
function calcularPresupuesto() {

    const necesidades = Number(
        document.getElementById("porcentajeNecesidades").value
    );

    const ahorro = Number(
        document.getElementById("porcentajeAhorro").value
    );

    const otros = Number(
        document.getElementById("porcentajeOtros").value
    );

    const suma = necesidades + ahorro + otros;

    const resultado =
        document.getElementById("resultadoPresupuesto");

    // Comprobar que los porcentajes sumen 100
    if (suma !== 100) {

        resultado.textContent =
            "Los porcentajes deben sumar exactamente 100%.";

        return;
    }

    const sueldo = obtenerSueldo();

    const cantidadNecesidades =
        sueldo * necesidades / 100;

    const cantidadAhorro =
        sueldo * ahorro / 100;

    const cantidadOtros =
        sueldo * otros / 100;

    resultado.innerHTML = `
        <p>
            Necesidades:
            <strong>Bs ${cantidadNecesidades.toFixed(2)}</strong>
        </p>

        <p>
            Ahorro:
            <strong>Bs ${cantidadAhorro.toFixed(2)}</strong>
        </p>

        <p>
            Otros gastos:
            <strong>Bs ${cantidadOtros.toFixed(2)}</strong>
        </p>
    `;
}

// Iniciar presupuesto
function iniciarPresupuesto() {

    mostrarIngreso();

    document
        .getElementById("btnCalcularPresupuesto")
        .addEventListener("click", calcularPresupuesto);
}

document.addEventListener(
    "DOMContentLoaded",
    iniciarPresupuesto
);