// ================================
// FUNCIONES DE INFORME
// ================================

// Obtener gastos
function obtenerGastos() {

    return JSON.parse(
        localStorage.getItem("gastos") || "[]"
    );
}

// Convertir fecha
function convertirFecha(fecha) {

    return new Date(
        fecha + "T00:00:00"
    );
}

// Calcular informes
function calcularInformes() {

    const gastos = obtenerGastos();

    const hoy = new Date();

    let diario = 0;
    let semanal = 0;
    let mensual = 0;

    gastos.forEach(function(gasto) {

        const fecha =
            convertirFecha(gasto.fecha);

        const monto =
            Number(gasto.monto);

        // Informe diario
        if (
            fecha.toDateString() ===
            hoy.toDateString()
        ) {

            diario += monto;
        }

        // Diferencia en días
        const diferencia =
            (hoy - fecha) /
            (1000 * 60 * 60 * 24);

        // Informe semanal
        if (
            diferencia >= 0 &&
            diferencia < 7
        ) {

            semanal += monto;
        }

        // Informe mensual
        if (
            fecha.getMonth() === hoy.getMonth() &&
            fecha.getFullYear() === hoy.getFullYear()
        ) {

            mensual += monto;
        }
    });

    // Mostrar resultados
    document.getElementById("diario")
        .textContent =
        "Bs " + diario.toFixed(2);

    document.getElementById("semanal")
        .textContent =
        "Bs " + semanal.toFixed(2);

    document.getElementById("mensual")
        .textContent =
        "Bs " + mensual.toFixed(2);

    dibujarGrafico(
        diario,
        semanal,
        mensual
    );
}

// Dibujar gráfico
function dibujarGrafico(
    diario,
    semanal,
    mensual
) {

    const canvas =
        document.getElementById("migrafico");

    new Chart(canvas, {

        type: "bar",

        data: {

            labels: [
                "Diario",
                "Semanal",
                "Mensual"
            ],

            datasets: [{

                label: "Gastos (Bs)",

                data: [
                    diario,
                    semanal,
                    mensual
                ]
            }]
        },

        options: {

            responsive: true,

            scales: {

                y: {

                    beginAtZero: true

                }
            }
        }
    });
}

// Iniciar informe
function iniciarInforme() {

    calcularInformes();
}

document.addEventListener(
    "DOMContentLoaded",
    iniciarInforme
);