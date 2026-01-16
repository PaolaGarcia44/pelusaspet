// carrito-unificado.js - GESTIÓN UNIFICADA DEL CARRITO

const CARRITO_KEY = 'carrito';

// ========== FUNCIONES PRINCIPALES ==========

// Función para obtener el carrito
function obtenerCarrito() {
    try {
        const carritoStr = localStorage.getItem(CARRITO_KEY);
        if (!carritoStr) return [];
        
        const carrito = JSON.parse(carritoStr);
        console.log(`Carrito obtenido: ${carrito.length} productos`);
        return carrito;
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        return [];
    }
}

// Función para guardar el carrito
function guardarCarrito(carrito) {
    try {
        localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
        console.log('Carrito guardado:', carrito);
        
        // Disparar eventos para sincronización
        window.dispatchEvent(new CustomEvent('carrito-actualizado', {
            detail: { carrito: carrito }
        }));
        
        // Actualizar badge global
        actualizarBadgeGlobal();
        
        return true;
    } catch (error) {
        console.error('Error al guardar carrito:', error);
        return false;
    }
}

// Función para agregar producto
function agregarProductoCarrito(producto) {
    const carrito = obtenerCarrito();
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
        productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    guardarCarrito(carrito);
    return carrito;
}

// Función para eliminar producto
function eliminarProductoCarrito(index) {
    const carrito = obtenerCarrito();
    if (index >= 0 && index < carrito.length) {
        const productoEliminado = carrito.splice(index, 1)[0];
        guardarCarrito(carrito);
        return productoEliminado;
    }
    return null;
}

// Función para actualizar cantidad
function actualizarCantidadProducto(index, cambio) {
    const carrito = obtenerCarrito();
    if (index >= 0 && index < carrito.length) {
        let nuevaCantidad = (carrito[index].cantidad || 1) + cambio;
        
        // Validar límites
        if (nuevaCantidad < 1) nuevaCantidad = 1;
        if (nuevaCantidad > 99) nuevaCantidad = 99;
        
        carrito[index].cantidad = nuevaCantidad;
        guardarCarrito(carrito);
        return carrito[index];
    }
    return null;
}

// Función para vaciar carrito
function vaciarCarrito() {
    guardarCarrito([]);
    return [];
}

// ========== FUNCIONES DE CÁLCULO ==========

// Calcular total de items
function calcularTotalItems() {
    const carrito = obtenerCarrito();
    return carrito.reduce((total, producto) => total + (producto.cantidad || 1), 0);
}

// Calcular subtotal
function calcularSubtotal() {
    const carrito = obtenerCarrito();
    return carrito.reduce((total, producto) => {
        const precio = Number(producto.price || producto.precio || 0);
        const cantidad = Number(producto.cantidad || 1);
        return total + (precio * cantidad);
    }, 0);
}

// ========== FUNCIÓN PARA ACTUALIZAR BADGE ==========

function actualizarBadgeGlobal() {
    const badge = document.querySelector('.cart-badge');
    if (!badge) return;
    
    const totalItems = calcularTotalItems();
    
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
    
    console.log(`Badge global actualizado: ${totalItems} items`);
}

// ========== FUNCIÓN PARA NOTIFICACIONES ==========

function mostrarNotificacionGlobal(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-global';
    
    let icono = 'fa-check-circle';
    if (tipo === 'error') icono = 'fa-times-circle';
    if (tipo === 'warning') icono = 'fa-exclamation-circle';
    
    notificacion.innerHTML = `
        <i class="fas ${icono}"></i>
        <span>${mensaje}</span>
    `;
    
    Object.assign(notificacion.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: tipo === 'success' ? '#4CAF50' : 
                   tipo === 'error' ? '#FF4444' : 
                   tipo === 'warning' ? '#FF9800' : '#5A216B',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: '10000',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        animation: 'slideInRight 0.3s ease'
    });
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

// ========== INICIALIZACIÓN ==========

document.addEventListener('DOMContentLoaded', function() {
    console.log('Carrito unificado inicializado');
    
    // Actualizar badge inicial
    actualizarBadgeGlobal();
    
    // Escuchar cambios en localStorage de otras pestañas
    window.addEventListener('storage', function(e) {
        if (e.key === CARRITO_KEY) {
            console.log('Carrito actualizado desde otra pestaña');
            actualizarBadgeGlobal();
        }
    });
    
    // Escuchar eventos personalizados
    window.addEventListener('carrito-actualizado', function() {
        actualizarBadgeGlobal();
    });
});

// ========== EXPORTAR FUNCIONES GLOBALES ==========

window.obtenerCarrito = obtenerCarrito;
window.guardarCarrito = guardarCarrito;
window.agregarProductoCarrito = agregarProductoCarrito;
window.eliminarProductoCarrito = eliminarProductoCarrito;
window.actualizarCantidadProducto = actualizarCantidadProducto;
window.vaciarCarrito = vaciarCarrito;
window.calcularTotalItems = calcularTotalItems;
window.calcularSubtotal = calcularSubtotal;
window.actualizarBadgeGlobal = actualizarBadgeGlobal;
window.mostrarNotificacionGlobal = mostrarNotificacionGlobal;