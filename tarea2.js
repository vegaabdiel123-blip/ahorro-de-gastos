
let usuario = null;
let gastos = [];
let metaAhorro = 0;
let grafica = null;

// Cargar datos guardados al iniciar
function cargarDatos() {
    const datos = localStorage.getItem('finanzas');
    if (datos) {
    const d = JSON.parse(datos);
    usuario = d.usuario;
    gastos = d.gastos || [];
    metaAhorro = d.metaAhorro || 0;
    }
}

// Guardar todo en el navegador
function guardarDatos() {
    localStorage.setItem('finanzas', JSON.stringify({
    usuario, gastos, metaAhorro
    }));
}

// Sumar todos los gastos
function totalGastado() {
    return gastos.reduce((suma, g) => suma + parseFloat(g.monto), 0);
}

// Cambiar entre páginas
function cambiarPagina(nombre) {
    document.querySelectorAll('.pagina').forEach(p => p.style.display = 'none');
    document.getElementById(`pag-${nombre}`).style.display = 'block';
}

// Eliminar un gasto
function eliminarGasto(indice) {
    if (confirm('¿Eliminar este gasto?')) {
    gastos.splice(indice, 1);
    guardarDatos();
    actualizarPantalla();
    }
}

// Guardar meta de ahorro
function guardarMeta() {
    metaAhorro = parseFloat(document.getElementById('metaAhorro').value) || 0;
    guardarDatos();
    actualizarPantalla();
    alert('Meta guardada ✅');
}

// Cerrar sesión
function cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
    usuario = null;
    document.getElementById('pantalla-bienvenida').style.display = 'block';
    document.getElementById('sistema').style.display = 'none';
    document.getElementById('formRegistro').reset();
    }
}

// Poner fecha de hoy automáticamente
function fechaHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaGasto').value = hoy;
}

// Generar informes
function hacerInformes() {
  // Por día
    const porDia = {};
    gastos.forEach(g => {
    if (!porDia[g.fecha]) porDia[g.fecha] = 0;
    porDia[g.fecha] += parseFloat(g.monto);
    });
    let htmlDia = '<ul>';
    for (let f in porDia) htmlDia += `<li>${f}: Bs ${porDia[f].toFixed(2)}</li>`;
    htmlDia += '</ul>';
    document.getElementById('informeDiario').innerHTML = htmlDia || '<p>Sin gastos</p>';

  // Por categoría
    const porCat = {};
    gastos.forEach(g => {
    if (!porCat[g.categoria]) porCat[g.categoria] = 0;
    porCat[g.categoria] += parseFloat(g.monto);
    });
    const total = totalGastado();
    const saldo = usuario.sueldo - total;
    let htmlMes = `
    <p>Sueldo: Bs ${usuario.sueldo.toFixed(2)}</p>
    <p>Total Gastos: Bs ${total.toFixed(2)}</p>
    <p>Saldo: Bs ${saldo.toFixed(2)}</p>
    <p>Meta: Bs ${metaAhorro.toFixed(2)} → ${saldo >= metaAhorro ? '✅ ALCANZADA' : '⚠️ NO ALCANZADA'}</p>
    <h4>Por Categoría:</h4><ul>
    `;
    for (let c in porCat) htmlMes += `<li>${c}: Bs ${porCat[c].toFixed(2)}</li>`;
    htmlMes += '</ul>';
    document.getElementById('informeMensual').innerHTML = htmlMes;
}

// Dibujar gráfica
function dibujarGrafica() {
    const porCat = {};
    gastos.forEach(g => {
    if (!porCat[g.categoria]) porCat[g.categoria] = 0;
    porCat[g.categoria] += parseFloat(g.monto);
    });
    const etiquetas = Object.keys(porCat);
    const valores = etiquetas.map(c => porCat[c]);

    if (grafica) grafica.destroy();
    const ctx = document.getElementById('graficaGastos').getContext('2d');
    grafica = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: etiquetas.length ? etiquetas : ['Sin datos'],
        datasets: [{
        label: 'Gastos en Bs',
        data: valores.length ? valores : [0],
        backgroundColor: ['#ff6384','#36a2eb','#ffce56','#4bc0c0','#9966ff']
        }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
}

// Descargar datos como archivo de texto
function exportarDatos() {
    let texto = `=== INFORME FINANCIERO ===\nUsuario: ${usuario.nombre}\nSueldo: Bs ${usuario.sueldo.toFixed(2)}\nMeta: Bs ${metaAhorro.toFixed(2)}\n\n--- GASTOS ---\n`;
    gastos.forEach(g => texto += `${g.fecha} | ${g.descripcion} | ${g.categoria} | Bs ${parseFloat(g.monto).toFixed(2)}\n`);
    texto += `\nTOTAL GASTADO: Bs ${totalGastado().toFixed(2)}`;
    
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(new Blob([texto], {type:'text/plain'}));
    enlace.download = 'informe_finanzas.txt';
    enlace.click();
}

// Actualizar TODO en pantalla
function actualizarPantalla() {
    if (!usuario) return;
    
    const total = totalGastado();
    const saldo = usuario.sueldo - total;

    document.getElementById('mostrarNombre').textContent = usuario.nombre;
    document.getElementById('resumenSueldo').textContent = usuario.sueldo.toFixed(2);
    document.getElementById('resumenGastos').textContent = total.toFixed(2);
    document.getElementById('resumenSaldo').textContent = saldo.toFixed(2);
    document.getElementById('progresoMeta').textContent = Math.max(0, saldo).toFixed(2);
    document.getElementById('metaAhorro').value = metaAhorro || '';
    document.getElementById('totalGastos').textContent = total.toFixed(2);

  // Tabla
    const cuerpo = document.getElementById('cuerpoTabla');
    cuerpo.innerHTML = '';
    gastos.forEach((g, i) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${g.fecha}</td>
        <td>${g.descripcion}</td>
        <td>${g.categoria}</td>
        <td>${parseFloat(g.monto).toFixed(2)}</td>
        <td><button onclick="eliminarGasto(${i})">X</button></td>
    `;
    cuerpo.appendChild(fila);
    });

    hacerInformes();
    dibujarGrafica();
}

// ==============================================
// INICIO - Cuando la página termina de cargar
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    fechaHoy();

  // Si ya hay sesión abierta
    if (usuario) {
    document.getElementById('pantalla-bienvenida').style.display = 'none';
    document.getElementById('sistema').style.display = 'block';
    actualizarPantalla();
    }

  // Formulario de registro
    document.getElementById('formRegistro').addEventListener('submit', e => {
    e.preventDefault();
    usuario = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        sueldo: parseFloat(document.getElementById('sueldoInicial').value)
    };
    guardarDatos();
    document.getElementById('pantalla-bienvenida').style.display = 'none';
    document.getElementById('sistema').style.display = 'block';
    actualizarPantalla();
    });

  // Formulario de gastos
    document.getElementById('formGasto').addEventListener('submit', e => {
    e.preventDefault();
    gastos.push({
        fecha: document.getElementById('fechaGasto').value,
        descripcion: document.getElementById('descripcionGasto').value,
        categoria: document.getElementById('categoriaGasto').value,
        monto: parseFloat(document.getElementById('montoGasto').value)
    });
    guardarDatos();
    actualizarPantalla();
    document.getElementById('formGasto').reset();
    fechaHoy();
    });
});