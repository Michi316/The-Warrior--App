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
// --- GUARDAR NUEVA VENTA ---
// --- GUARDAR NUEVA VENTA (CORREGIDA) ---
function guardarVenta() {
    const fecha = new Date().toLocaleDateString('es-ES');
    const inputCliente = document.getElementById('cliente');
    const cliente = inputCliente ? inputCliente.value.trim() : "Anónimo";

    if (esGalletas) {
        // --- ESTA PARTE SE QUEDA EXACTAMENTE IGUAL, NO SE TOCA ---
        const sabor = document.getElementById('sabor-galleta').value.trim();
        const cantidad = parseInt(document.getElementById('cantidad').value) || 0;
        const precio = parseFloat(document.getElementById('precio').value) || 0;
        const total = cantidad * precio;
        db.push({ fecha, cliente, sabor, cantidad, precio, total, estado: 'Pago' });
        localStorage.setItem(dbKey, JSON.stringify(db));
    } 
    else if (esEmpanadas) {
        // --- SOLO MODIFICAMOS AQUÍ PARA EMPANADAS ---
        const tipo = document.getElementById('tipo').value.trim();
        const cantidad = parseInt(document.getElementById('cantidad').value) || 0;
        const precio = parseFloat(document.getElementById('precio').value) || 0;
        const salsa = document.getElementById('salsa').value;
        
        // Obtenemos si es combo desde tu HTML
        const esCombo = document.getElementById('es-combo').value === 'Sí';
        const cantCombo = parseInt(document.getElementById('cant-combo').value) || 0;
        
        // Lógica: La cantidad total de empanadas es la manual + el doble de los combos
        const totalEmpanadas = cantEmp + (esCombo ? (cantCombo * 2) : 0);
        
        // Calculamos el precio total (asumiendo que el combo cuesta 3.00 como tenías en tu script previo)
        const total = (cantidad * precio) + (esCombo ? (cantCombo * 3.00) : 0);

        db.push({ 
    fecha, 
    cliente, 
    tipo: esCombo ? (tipo + " + Combo") : tipo,
    cantEmp, 
    cantCombo: esCombo ? cantCombo : 0, 
    totalEmpanadas: totalEmpanadas, // Guardamos el cálculo real aquí
    salsa, 
    refresco, 
    tamanoRef, 
    cantRef, 
    total, 
    estado: 'Pago' 
});
        localStorage.setItem('tw_empanadas', JSON.stringify(db));
    }
    
    if (typeof actualizarTabla === 'function') {
        actualizarTabla();
    }
}

// --- ACTUALIZAR TABLA ---
function actualizarTabla() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    db.forEach((item, index) => {
        const tr = document.createElement('tr');
        
        // Usamos item.tipo o item.sabor según lo que exista
        const producto = item.tipo || item.sabor || 'N/A';
        
        tr.innerHTML = `
            <td>${item.fecha}</td>
            <td>${item.cliente}</td>
            <td>${producto}</td>
            <td>${item.cantidad || 0}</td>
            <td>$${(item.precio || 0).toFixed(2)}</td>
            <td>$${(item.total || 0).toFixed(2)}</td>
            <td><button onclick="eliminarRegistro(${index})">Eliminar</button></td>
        `;
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

