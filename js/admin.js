// admin.js - Panel de administración simple
document.addEventListener('DOMContentLoaded', function() {
    console.log('Panel admin cargado');
    
    // Verificar si estamos en admin.html
    if (!document.querySelector('.admin-dashboard')) {
        return;
    }
    
    // Protección básica (en producción usarías autenticación real)
    const password = prompt('Ingresa la contraseña de administración:');
    if (password !== 'admin123') { // Cambia esto en producción
        alert('Contraseña incorrecta');
        window.location.href = 'index.html';
        return;
    }
    
    // Elementos del dashboard
    const pedidosHoy = document.getElementById('pedidos-hoy');
    const ingresosMes = document.getElementById('ingresos-mes');
    const clientesNuevos = document.getElementById('clientes-nuevos');
    const tablaPedidos = document.getElementById('tabla-pedidos');
    
    // Cargar pedidos
    function cargarPedidos() {
        const pedidos = JSON.parse(localStorage.getItem('pelusaspet_pedidos')) || [];
        
        // Calcular estadísticas
        const hoy = new Date().toDateString();
        const pedidosHoyCount = pedidos.filter(p => 
            new Date(p.fecha).toDateString() === hoy
        ).length;
        
        const esteMes = new Date().getMonth();
        const ingresosEsteMes = pedidos
            .filter(p => new Date(p.fecha).getMonth() === esteMes)
            .reduce((total, p) => total + p.total, 0);
        
        const clientesUnicos = [...new Set(pedidos.map(p => p.cliente.email))].length;
        
        // Actualizar estadísticas
        if (pedidosHoy) pedidosHoy.textContent = pedidosHoyCount;
        if (ingresosMes) ingresosMes.textContent = `$${ingresosEsteMes.toLocaleString()}`;
        if (clientesNuevos) clientesNuevos.textContent = clientesUnicos;
        
        // Actualizar tabla
        if (tablaPedidos && tablaPedidos.querySelector('tbody')) {
            const tbody = tablaPedidos.querySelector('tbody');
            tbody.innerHTML = '';
            
            // Últimos 10 pedidos
            const ultimosPedidos = pedidos.slice(-10).reverse();
            
            ultimosPedidos.forEach(pedido => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pedido.id}</td>
                    <td>${pedido.cliente.nombre}</td>
                    <td>$${pedido.total.toLocaleString()}</td>
                    <td><span class="estado-${pedido.estado}">${pedido.estado}</span></td>
                    <td>
                        <button class="btn-ver" onclick="verPedido('${pedido.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-actualizar" onclick="actualizarEstado('${pedido.id}')">
                            <i class="fas fa-sync"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    }
    
    // Ver pedido
    window.verPedido = function(pedidoId) {
        const pedidos = JSON.parse(localStorage.getItem('pelusaspet_pedidos')) || [];
        const pedido = pedidos.find(p => p.id === pedidoId);
        
        if (pedido) {
            const detalles = `
            Detalles del pedido ${pedidoId}:
            
            Cliente: ${pedido.cliente.nombre}
            Email: ${pedido.cliente.email}
            Teléfono: ${pedido.cliente.telefono}
            Dirección: ${pedido.cliente.direccion}
            Ciudad: ${pedido.cliente.ciudad}
            
            Productos:
            ${pedido.productos.map(p => `• ${p.name} x${p.cantidad} - $${p.price * p.cantidad}`).join('\n')}
            
            Subtotal: $${pedido.subtotal}
            Envío: $${pedido.envio}
            Total: $${pedido.total}
            
            Estado: ${pedido.estado}
            Fecha: ${new Date(pedido.fecha).toLocaleString()}
            `;
            
            alert(detalles);
        }
    };
    
    // Actualizar estado
    window.actualizarEstado = function(pedidoId) {
        const nuevoEstado = prompt('Nuevo estado (pendiente/procesado/enviado/entregado):');
        if (!nuevoEstado) return;
        
        const pedidos = JSON.parse(localStorage.getItem('pelusaspet_pedidos')) || [];
        const pedidoIndex = pedidos.findIndex(p => p.id === pedidoId);
        
        if (pedidoIndex !== -1) {
            pedidos[pedidoIndex].estado = nuevoEstado.toLowerCase();
            localStorage.setItem('pelusaspet_pedidos', JSON.stringify(pedidos));
            alert('Estado actualizado');
            cargarPedidos();
        }
    };
    
    // Exportar datos
    window.exportarDatos = function() {
        const pedidos = JSON.parse(localStorage.getItem('pelusaspet_pedidos')) || [];
        const datos = JSON.stringify(pedidos, null, 2);
        const blob = new Blob([datos], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `pedidos-pelusaspet-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };
    
    // Inicializar
    cargarPedidos();
    
    // Actualizar cada 30 segundos
    setInterval(cargarPedidos, 30000);
});