// --- DETECTAR EN QUÉ PÁGINA ESTAMOS ---
const esGalletas = document.getElementById('sabor-galleta') !== null;
const esEmpanadas = document.getElementById('sabor') !== null;

// Determinar qué base de datos usar según la pantalla activa
const dbKey = esGalletas ? 'tw_galletas' : 'tw_empanadas';
let db = JSON.parse(localStorage.getItem(dbKey)) || [];

// Renderizar la tabla de forma inmediata al entrar
if (esGalletas || esEmpanadas) {
    actualizarTabla();
}

// --- GUARDAR NUEVA VENTA ---
function guardarVenta() {
    const fecha = new Date().toLocaleDateString('es-ES');
    const cliente = document.getElementById('cliente').value.trim();

    if (esGalletas) {
        const sabor = document.getElementById('sabor-galleta').value.trim();
        const cantidad = parseInt(document.getElementById('cantidad').value) || 0;
        const precio = parseFloat(document.getElementById('precio').value) || 0;
        
        // Lógica matemática automática
        const total = cantidad * precio;

        // Guardamos el registro con la nueva estructura
        db.push({ fecha, cliente, sabor, cantidad, precio, total });
        localStorage.setItem(dbKey, JSON.stringify(db));
        
        // Limpiar el formulario de galletas
        document.getElementById('cliente').value = '';
        document.getElementById('sabor-galleta').value = '';
        document.getElementById('cantidad').value = '';
        document.getElementById('precio').value = '';

    } else if (esEmpanadas) {
        const sabor = document.getElementById('sabor').value.trim();
        const total = parseFloat(document.getElementById('total').value) || 0;
        const pagado = parseFloat(document.getElementById('pagado').value) || 0;
        
        db.push({ fecha, cliente, detalle: sabor, total, pagado, debe: total - pagado });
        localStorage.setItem(dbKey, JSON.stringify(db));
        
        document.getElementById('cliente').value = '';
        document.getElementById('sabor').value = '';
        document.getElementById('total').value = '';
        document.getElementById('pagado').value = '';
    }
    
    actualizarTabla();
}

// --- ACTUALIZAR LA TABLA EN PANTALLA ---
function actualizarTabla() {
    const tbody = document.getElementById('tabla-datos');
    if (!tbody) return;
    tbody.innerHTML = '';

    db.forEach((item, index) => {
        const tr = document.createElement('tr');

        if (esGalletas) {
            // Usamos || para evitar que se rompa con datos viejos de tus pruebas anteriores
            const saborItem = item.sabor || "No especificado";
            const cantItem = item.cantidad || 0;
            const precioItem = item.precio ? item.precio.toFixed(2) : "0.00";
            const totalItem = item.total ? item.total.toFixed(2) : "0.00";

            tr.innerHTML = `
                <td>${item.fecha || 'Sin fecha'}</td>
                <td>${item.cliente || 'Anónimo'}</td>
                <td>${saborItem}</td>
                <td>${cantItem}</td>
                <td>$${precioItem}</td>
                <td class="pagado-exito">$${totalItem}</td>
                <td>
                    <button class="btn-borrar" onclick="eliminarRegistro(${index})">Eliminar</button>
                </td>
            `;
        } else if (esEmpanadas) {
            const deuda = item.debe || 0;
            const claseDeuda = deuda > 0 ? 'debe-alerta' : 'pagado-exito';
            const textoDeuda = deuda > 0 ? `$${deuda.toFixed(2)}` : 'Saldado';
            const botonSaldar = deuda > 0 ? `<button class="btn-saldar" onclick="saldarCuenta(${index})">Saldar</button>` : '';

            tr.innerHTML = `
                <td>${item.fecha}</td>
                <td>${item.cliente}</td>
                <td>${item.detalle}</td>
                <td>$${(item.total || 0).toFixed(2)}</td>
                <td>$${(item.pagado || 0).toFixed(2)}</td>
                <td class="${claseDeuda}">${textoDeuda}</td>
                <td>
                    ${botonSaldar}
                    <button class="btn-borrar" onclick="eliminarRegistro(${index})">Eliminar</button>
                </td>
            `;
        }
        tbody.appendChild(tr);
    });
}

// --- SALDAR DEUDA ---
function saldarCuenta(index) {
    if (esEmpanadas) {
        db[index].pagado = db[index].total;
        db[index].debe = 0;
        localStorage.setItem(dbKey, JSON.stringify(db));
        actualizarTabla();
    }
}

// --- ELIMINAR REGISTRO ---
function eliminarRegistro(index) {
    const mensaje = esGalletas ? "¿Eliminar esta venta de galletas?" : "¿Eliminar esta venta de empanadas?";
    if (confirm(mensaje)) {
        db.splice(index, 1);
        localStorage.setItem(dbKey, JSON.stringify(db));
        actualizarTabla();
    }
}