function leerGastos() {
    try {
    const texto = localStorage.getItem("listagastos");
        return texto ? JSON.parse(texto) : [];
    } catch (e) {
        return window.__gastosMemoria || [];
    }
}

function guardarGastos(lista) {
    try {
        localStorage.setItem("listagastos", JSON.stringify(lista));
    } catch (e) {
        window.__gastosMemoria = lista;
    }
}

let gastos = leerGastos();
let grafico;

function iniciargrafico() {
    const canvas = document.getElementById('migrafico');
    if (!canvas) return; // por seguridad

    const ctx = canvas.getContext('2d');
    
    const categorias = ['alimento', 'transporte', 'entretenimiento', 'vivienda', 'otros'];
    const etiquetas = ['Alimentos', 'Transporte', 'Entretenimiento', 'Vivienda', 'Otros'];

    const totales = categorias.map(cat => 
        gastos.filter(g => g.categoria === cat)
            .reduce((sum, g) => sum + parseFloat(g.monto || 0), 0)
    );

    if (grafico) grafico.destroy();

    grafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Gastos en Bolivianos',
                data: totales,
                backgroundColor: ['#4dc0eb', '#ff6384', '#ffce56', '#36a2eb', '#4bc0c0']
            }]
        },
        options: {
            scales: { 
                y: { beginAtZero: true }
            }
        }
    });
}

window.onload = function() {
    
    const form = document.getElementById("formgastos");
    
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            const nuevogasto = {
                descripcion: document.getElementById("descripcion").value,
                monto: parseFloat(document.getElementById("monto").value),
                categoria: document.getElementById("categoria").value,
                fecha: document.getElementById("fecha").value
            };

            gastos.push(nuevogasto);
            guardarGastos(gastos);          
            this.reset();
            iniciargrafico();
            alert("Gasto agregado y estadísticas actualizadas");
        });
    } else {
        console.error("No se encontró el formulario con id 'formgastos'");
    }

    
    iniciargrafico();
};