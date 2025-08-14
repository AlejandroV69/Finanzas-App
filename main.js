let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];
let chartIngresosGastos = null;

const form = document.getElementById("formTransaccion");
const tablaBody = document.querySelector("#tablaHistorial tbody");

function guardarDatos() {
    localStorage.setItem("transacciones", JSON.stringify(transacciones));
}

function renderHistorial() {
    tablaBody.innerHTML = "";
    transacciones.forEach((t, i) => {
        let fila = `
            <tr>
                <td>${t.tipo}</td>
                <td>Bs ${t.monto}</td>
                <td>${t.fecha}</td>
                <td>${t.descripcion || ""}</td>
                <td><button onclick="eliminar(${i})">❌</button></td>
            </tr>
        `;
        tablaBody.innerHTML += fila;
    });
}

function renderGraficos() {
    const ingresos = transacciones.filter(t => t.tipo === "ingreso").reduce((a, b) => a + Number(b.monto), 0);
    const gastos = transacciones.filter(t => t.tipo === "gasto").reduce((a, b) => a + Number(b.monto), 0);

    const ctx1 = document.getElementById('graficoIngresosGastos').getContext('2d');
    if (chartIngresosGastos) chartIngresosGastos.destroy();
    chartIngresosGastos = new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: ['Ingresos', 'Gastos'],
            datasets: [{
                label: 'Monto',
                data: [ingresos, gastos],
                backgroundColor: ['green', 'red']
            }]
        }
    });
}

form.addEventListener("submit", e => {
    e.preventDefault();
    const nueva = {
        tipo: document.getElementById("tipo").value,
        monto: parseFloat(document.getElementById("monto").value),
        fecha: document.getElementById("fecha").value,
        descripcion: document.getElementById("descripcion").value
    };
    transacciones.push(nueva);
    guardarDatos();
    renderHistorial();
    renderGraficos();
    form.reset();
});

function eliminar(index) {
    transacciones.splice(index, 1);
    guardarDatos();
    renderHistorial();
    renderGraficos();
}

document.addEventListener("DOMContentLoaded", () => {
    renderHistorial();
    renderGraficos();
});

// Resumen mensual en bolívares
function mostrarResumenMensual() {
    const resumenDiv = document.getElementById("resumenMensual");
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();

    // Filtra transacciones del mes actual
    const transMes = transacciones.filter(t => {
        const fecha = new Date(t.fecha);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
    });

    const totalIngresos = transMes.filter(t => t.tipo === "ingreso").reduce((a, b) => a + Number(b.monto), 0);
    const totalGastos = transMes.filter(t => t.tipo === "gasto").reduce((a, b) => a + Number(b.monto), 0);

    // Agrupa gastos por descripción
    const gastosPorDescripcion = {};
    transMes.filter(t => t.tipo === "gasto").forEach(t => {
        const desc = t.descripcion || "Sin descripción";
        gastosPorDescripcion[desc] = (gastosPorDescripcion[desc] || 0) + Number(t.monto);
    });

    // Encuentra el gasto más alto
    let mayorGasto = { desc: "", monto: 0 };
    for (const desc in gastosPorDescripcion) {
        if (gastosPorDescripcion[desc] > mayorGasto.monto) {
            mayorGasto = { desc, monto: gastosPorDescripcion[desc] };
        }
    }

    // Sugerencia de ahorro
    let sugerencia = "¡Buen trabajo! No hay gastos significativos este mes.";
    if (mayorGasto.monto > 0) {
        sugerencia = `Podrías economizar más en: <b>${mayorGasto.desc}</b> (Bs ${mayorGasto.monto.toFixed(2)})`;
    }

    resumenDiv.innerHTML = `
        <h3>Resumen de ${hoy.toLocaleString('es-VE', { month: 'long', year: 'numeric' })}</h3>
        <p><b>Total ingresos:</b> Bs ${totalIngresos.toFixed(2)}</p>
        <p><b>Total gastos:</b> Bs ${totalGastos.toFixed(2)}</p>
        <p><b>Balance:</b> Bs ${(totalIngresos - totalGastos).toFixed(2)}</p>
        <p><b>Sugerencia de ahorro:</b> ${sugerencia}</p>
    `;
    resumenDiv.style.display = "block";
}

document.getElementById("btnResumen").addEventListener("click", mostrarResumenMensual);

// Resumen mensual en dólares
function mostrarResumenMensualDolar() {
    const resumenDiv = document.getElementById("resumenMensualDolar");
    const valorDolar = parseFloat(document.getElementById("valorDolar").value);

    if (!valorDolar || valorDolar <= 0) {
        resumenDiv.innerHTML = "<p style='color:red;'>Por favor ingresa un valor válido para el dólar.</p>";
        resumenDiv.style.display = "block";
        return;
    }

    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();

    // Filtra transacciones del mes actual
    const transMes = transacciones.filter(t => {
        const fecha = new Date(t.fecha);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
    });

    const totalIngresosBs = transMes.filter(t => t.tipo === "ingreso").reduce((a, b) => a + Number(b.monto), 0);
    const totalGastosBs = transMes.filter(t => t.tipo === "gasto").reduce((a, b) => a + Number(b.monto), 0);

    const totalIngresosUsd = totalIngresosBs / valorDolar;
    const totalGastosUsd = totalGastosBs / valorDolar;
    const balanceUsd = totalIngresosUsd - totalGastosUsd;

    resumenDiv.innerHTML = `
        <h3>Resumen mensual en dólares (${hoy.toLocaleString('es-VE', { month: 'long', year: 'numeric' })})</h3>
        <p><b>Total ingresos:</b> $${totalIngresosUsd.toFixed(2)}</p>
        <p><b>Total gastos:</b> $${totalGastosUsd.toFixed(2)}</p>
        <p><b>Balance:</b> $${balanceUsd.toFixed(2)}</p>
        <small style="color:#888;">(Usando valor del dólar: Bs ${valorDolar})</small>
    `;
    resumenDiv.style.display = "block";
}

document.getElementById("btnResumenDolar").addEventListener("click", mostrarResumenMensualDolar);
document.getElementById("btnModoOscuro").addEventListener("click", () => {
    document.body.classList.toggle("modo-oscuro");
});
