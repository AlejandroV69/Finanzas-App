<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FinanTrack | Mi Gestor de Gastos</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="container">
        <header>
            <h1>FinanTrack</h1>
            <p>Controla tus finanzas con inteligencia</p>
        </header>

        <section class="balance-container">
            <h4>Tu Balance Actual</h4>
            <h2 id="balance">$0.00</h2>

            <div class="inc-exp-container">
                <div>
                    <h4>Ingresos</h4>
                    <p id="money-plus" class="money plus">+$0.00</p>
                </div>
                <div>
                    <h4>Gastos</h4>
                    <p id="money-minus" class="money minus">-$0.00</p>
                </div>
            </div>
        </section>

        <section class="history-container">
            <h3>Historial</h3>
            <ul id="list" class="list">
                </ul>
        </section>

        <section class="form-container">
            <h3>Añadir nueva transacción</h3>
            <form id="form">
                <div class="form-control">
                    <label for="text">Concepto</label>
                    <input type="text" id="text" placeholder="Ej: Salario, Alquiler, Pizza..." required />
                </div>
                <div class="form-control">
                    <label for="amount">Monto <br />
                        <small>(Negativo = gasto, Positivo = ingreso)</small>
                    </label>
                    <input type="number" step="0.01" id="amount" placeholder="Ej: -50 o 1200" required />
                </div>
                <button class="btn">Agregar Transacción</button>
            </form>
        </section>
    </div>

    <script src="script.js"></script>
</body>
</html>
