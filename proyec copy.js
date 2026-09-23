
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


function showPage(nombre, boton) {
    
    document.querySelectorAll('.page').forEach(pagina => pagina.style.display = 'none');
    // Muestra la página seleccionada
    const paginaActiva = document.getElementById(nombre);
    if (paginaActiva) paginaActiva.style.display = 'block';

    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('activo'));
    if (boton) boton.classList.add('activo');

    
    if (nombre === 'estadistica') iniciargrafico();
}


function actualizarResumen() {
    const totalGastos = gastos.reduce((suma, g) => suma + parseFloat(g.monto || 0), 0);
    const sueldo = parseFloat(localStorage.getItem("sueldo")) || 0;
    const saldo = sueldo - totalGastos;

    const elSueldo = document.getElementById('mostrarsueldo');
    const elGastos = document.getElementById('mostrargastos');
    const elSaldo = document.getElementById('saldo');

    if (elSueldo) elSueldo.textContent = sueldo.toFixed(2);
    if (elGastos) elGastos.textContent = totalGastos.toFixed(2);
    if (elSaldo) elSaldo.textContent = saldo.toFixed(2);
}


function iniciargrafico() {
    const canvas = document.getElementById('migrafico');
    if (!canvas) return;
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
    
    showPage('dashboard');

    
    const campoFecha = document.getElementById('fecha');
    if (campoFecha) {
        const hoy = new Date().toISOString().split('T')[0];
        campoFecha.value = hoy;
    }

    
    actualizarResumen();

    
    const btnGuardarSueldo = document.getElementById('btnguardarsueldo');
    if (btnGuardarSueldo) {
        btnGuardarSueldo.addEventListener('click', function() {
            const valor = document.getElementById('sueldo').value;
            const sueldo = parseFloat(valor) || 0;
            localStorage.setItem('sueldo', sueldo);
            actualizarResumen();
            alert('Sueldo guardado correctamente ✅');
        });
    }


    const formGastos = document.getElementById('formgastos');
    if (formGastos) {
        formGastos.addEventListener('submit', function(e) {
            e.preventDefault();

            const nuevo = {
                descripcion: document.getElementById('descripcion').value,
                monto: parseFloat(document.getElementById('monto').value),
                categoria: document.getElementById('categoria').value,
                fecha: document.getElementById('fecha').value
            };

            gastos.push(nuevo);
            guardarGastos(gastos);
            actualizarResumen();
            iniciargrafico();

            this.reset();
            
            if (campoFecha) campoFecha.value = new Date().toISOString().split('T')[0];
            alert('Gasto agregado ✅');
        });
    } else {
        console.error('No se encontró el formulario #formgastos');
    }


    const btnVerLista = document.getElementById('btnverlistas');
    if (btnVerLista) {
        btnVerLista.addEventListener('click', function() {
            const contenedor = document.getElementById('contenedorlista');
            if (!contenedor) return;

            
            const estaOculto = contenedor.style.display === 'none' || contenedor.style.display === '';
            contenedor.style.display = estaOculto ? 'block' : 'none';
            if (!estaOculto) return; 

            
            const tabla = document.getElementById('tablagastos');
            while (tabla.rows.length > 1) tabla.deleteRow(1);

            
            gastos.forEach(gasto => {
                const fila = tabla.insertRow();
                fila.insertCell(0).textContent = gasto.fecha;
                fila.insertCell(1).textContent = gasto.descripcion;
                fila.insertCell(2).textContent = gasto.categoria;
                fila.insertCell(3).textContent = parseFloat(gasto.monto).toFixed(2);
            });

            const total = gastos.reduce((s, g) => s + parseFloat(gasto.monto || 0), 0);
            const elTotal = document.getElementById('totalgastos');
            if (elTotal) elTotal.textContent = total.toFixed(2);
        });
    }
};
// ===== FUNCIONES PARA GENERAR INFORMES =====

function obtenerFechaHoy() {
  return new Date().toISOString().split('T')[0]; // formato: 2026-09-22
}

// INFORME DIARIO
function generarInformeDiario() {
    const hoy = obtenerFechaHoy();
    const gastosHoy = gastos.filter(g => g.fecha === hoy);
    const total = gastosHoy.reduce((s, g) => s + parseFloat(g.monto || 0), 0);
    
    let html = `<h3>📅 Informe Diario — ${hoy}</h3>`;
    html += `<p><strong>Total gastado hoy: Bs ${total.toFixed(2)}</strong></p>`;
    
    if (gastosHoy.length === 0) {
    html += `<p>No hay gastos registrados hoy </p>`;
    } else {
    html += `<table style="width:100%; border-collapse:collapse; margin-top:10px;">
        <tr style="background:#eee;">
            <th style="padding:8px; border:1px solid #ccc;">Descripción</th>
            <th style="padding:8px; border:1px solid #ccc;">Categoría</th>
            <th style="padding:8px; border:1px solid #ccc;">Monto (Bs)</th>
        </tr>`;
    gastosHoy.forEach(g => {
        html += `<tr>
            <td style="padding:6px; border:1px solid #ccc;">${g.descripcion}</td>
            <td style="padding:6px; border:1px solid #ccc;">${g.categoria}</td>
            <td style="padding:6px; border:1px solid #ccc;">${parseFloat(g.monto).toFixed(2)}</td>
        </tr>`;
    });
    html += `</table>`;
    }
    return html;
}

// INFORME SEMANAL
function generarInformeSemanal() {
    const hoy = new Date();
    const hace7dias = new Date();
    hace7dias.setDate(hoy.getDate() - 7);
    
    const gastosSemana = gastos.filter(g => {
    const fechaGasto = new Date(g.fecha);
    return fechaGasto >= hace7dias && fechaGasto <= hoy;
    });
    
    const total = gastosSemana.reduce((s, g) => s + parseFloat(g.monto || 0), 0);
    
    let html = `<h3>📆 Informe Semanal — Últimos 7 días</h3>`;
    html += `<p><strong>Total gastado: Bs ${total.toFixed(2)}</strong></p>`;
    
    // Totales por categoría
    const categorias = ['alimento', 'transporte', 'entretenimiento', 'vivienda', 'otros'];
    html += `<h4>Por categoría:</h4><ul>`;
    categorias.forEach(cat => {
    const catTotal = gastosSemana.filter(g => g.categoria === cat)
        .reduce((s, g) => s + parseFloat(g.monto || 0), 0);
    if (catTotal > 0) html += `<li>${cat}: Bs ${catTotal.toFixed(2)}</li>`;
    });
    html += `</ul>`;
    
    if (gastosSemana.length === 0) {
    html += `<p>No hay gastos en la última semana ✅</p>`;
    }
    return html;
}

// INFORME MENSUAL
function generarInformeMensual() {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();
    
    const gastosMes = gastos.filter(g => {
    const fechaGasto = new Date(g.fecha);
    return fechaGasto.getMonth() === mesActual && 
            fechaGasto.getFullYear() === anioActual;
    });
    
    const total = gastosMes.reduce((s, g) => s + parseFloat(g.monto || 0), 0);
    const sueldo = parseFloat(localStorage.getItem("sueldo")) || 0;
    const saldo = sueldo - total;
    
    let html = `<h3>📊 Informe Mensual — ${anioActual}, mes ${mesActual + 1}</h3>`;
    html += `<p>Ingresos: Bs ${sueldo.toFixed(2)}</p>`;
    html += `<p><strong>Gastos: Bs ${total.toFixed(2)}</strong></p>`;
    html += `<p>Saldo: <strong style="color:${saldo >= 0 ? 'green' : 'red'};">Bs ${saldo.toFixed(2)}</strong></p>`;

  // Por categoría
    const categorias = ['alimento', 'transporte', 'entretenimiento', 'vivienda', 'otros'];
    html += `<h4>Desglose por categoría:</h4><ul>`;
    categorias.forEach(cat => {
    const catTotal = gastosMes.filter(g => g.categoria === cat)
                                .reduce((s, g) => s + parseFloat(g.monto || 0), 0);
    const porcentaje = sueldo > 0 ? ((catTotal / sueldo) * 100).toFixed(1) : 0;
    if (catTotal > 0) {
        html += `<li>${cat}: Bs ${catTotal.toFixed(2)} (${porcentaje}% del sueldo)</li>`;
    }
    });
    html += `</ul>`;
    
    if (gastosMes.length === 0) {
    html += `<p>No hay gastos registrados este mes </p>`;
    }
    return html;
}

// CARGAR INFORMES AL ENTRAR A LA PÁGINA
document.addEventListener('DOMContentLoaded', function() {
  // Cuando se muestre la página de informes
    const observador = new MutationObserver(() => {
    if (document.getElementById('informee').style.display !== 'none') {
        const diario = document.querySelector('.diario');
        const semanal = document.querySelector('.semanal');
        const mensual = document.querySelector('.mensual');
        
        if (diario) diario.innerHTML = `<h2>Informe Diario</h2>` + generarInformeDiario();
        if (semanal) semanal.innerHTML = `<h2>Informe Semanal</h2>` + generarInformeSemanal();
        if (mensual) mensual.innerHTML = `<h2>Informe Mensual</h2>` + generarInformeMensual();
    }
    });
    
    observador.observe(document.getElementById('informee'), { attributes: true, attributeFilter: ['style'] });
});


// ===== ESTADÍSTICAS COMPLETAS =====
function iniciargrafico() {
    const canvas = document.getElementById('migrafico');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Categorías y colores
    const categorias = ['alimento', 'transporte', 'entretenimiento', 'vivienda', 'otros'];
    const etiquetas = ['Alimentos', 'Transporte', 'Entretenimiento', 'Vivienda', 'Otros'];
    const colores = ['#4dc0eb', '#ff6384', '#ffce56', '#36a2eb', '#4bc0c0'];
    
    // Calcular totales
    const totales = categorias.map(cat =>
        gastos.filter(g => g.categoria === cat)
            .reduce((sum, g) => sum + parseFloat(g.monto || 0), 0)
    );
    
    const totalGeneral = totales.reduce((a, b) => a + b, 0);


    
    // Destruir gráfico anterior si existe
    if (grafico) grafico.destroy();

    // Crear gráfico combinado
    grafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: 'Gastos en Bolivianos',
                    data: totales,
                    backgroundColor: colores,
                    borderWidth: 2,
                    borderColor: '#fff'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(item) {
                            const valor = item.raw;
                            const porcentaje = totalGeneral > 0 
                                ? ((valor / totalGeneral) * 100).toFixed(1) 
                                : 0;
                            return `Bs ${valor.toFixed(2)} (${porcentaje}%)`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: `Total Gastado: Bs ${totalGeneral.toFixed(2)}`,
                    font: { size: 18, weight: 'bold' },
                    color: '#2c3e50'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => 'Bs ' + v }
                }
            }
        }
    });

    // Mostrar resumen numérico debajo del gráfico
    const contenedor = document.querySelector('.grafico-contenedor');
    if (contenedor) {
        let resumenHTML = `<div style="margin-top:20px; padding:15px; background:#f8f9fa; border-radius:10px;">
            <h3>📊 Desglose por Categoría</h3>
            <table style="width:100%; border-collapse:collapse; margin-top:10px;">
                <tr style="background:#e9ecef;">
                    <th style="padding:10px; text-align:left; border-bottom:2px solid #dee2e6;">Categoría</th>
                    <th style="padding:10px; text-align:right; border-bottom:2px solid #dee2e6;">Monto (Bs)</th>
                    <th style="padding:10px; text-align:right; border-bottom:2px solid #dee2e6;">%</th>
                </tr>`;
        
        totales.forEach((monto, i) => {
            const porcentaje = totalGeneral > 0 ? ((monto / totalGeneral) * 100).toFixed(1) : 0;
            resumenHTML += `<tr>
                <td style="padding:8px; border-bottom:1px solid #dee2e6;">
                    <span style="display:inline-block; width:12px; height:12px; background:${colores[i]}; border-radius:3px; margin-right:8px;"></span>
                    ${etiquetas[i]}
                </td>
                <td style="padding:8px; text-align:right; border-bottom:1px solid #dee2e6;">${monto.toFixed(2)}</td>
                <td style="padding:8px; text-align:right; border-bottom:1px solid #dee2e6;">${porcentaje}%</td>
            </tr>`;
        });
        
        resumenHTML += `</table>
            <p style="margin-top:15px; font-size:16px;">
                <strong>Total General: Bs ${totalGeneral.toFixed(2)}</strong>
            </p>
        </div>`;
        
        // Reemplazar o agregar el resumen
        const viejoResumen = document.getElementById('resumen-estadisticas');
        if (viejoResumen) viejoResumen.remove();
        contenedor.insertAdjacentHTML('beforeend', `<div id="resumen-estadisticas">${resumenHTML}</div>`);
    }
}