// Agregar al inicio para debug
console.log('=== VERIFICANDO CARRITO ===');
console.log('localStorage con clave "carrito":', localStorage.getItem('carrito'));
console.log('localStorage con clave "pelusaspet_carrito":', localStorage.getItem('pelusaspet_carrito'));

// Si hay datos en pelusaspet_carrito pero no en carrito, migrarlos
const carritoViejo = localStorage.getItem('pelusaspet_carrito');
const carritoNuevo = localStorage.getItem('carrito');

if (carritoViejo && !carritoNuevo) {
    console.log('Migrando datos de pelusaspet_carrito a carrito...');
    localStorage.setItem('carrito', carritoViejo);
    localStorage.removeItem('pelusaspet_carrito');
}
// carrito-page.js - VERSIÓN CORREGIDA Y COMPROBADA
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIALIZANDO PÁGINA DEL CARRITO ===');
    
    // DEBUG: Verificar contenido del carrito
    const carritoStorage = localStorage.getItem('carrito');
    console.log('DEBUG - localStorage raw:', carritoStorage);
    console.log('DEBUG - JSON parseado:', JSON.parse(carritoStorage || '[]'));
    
    // Obtener elementos del DOM
    const listaCarrito = document.getElementById('lista-carrito');
    const subtotalElement = document.getElementById('subtotal');
    const totalPedidoElement = document.getElementById('total-pedido');
    const totalItemsElement = document.getElementById('total-items');
    const btnVaciar = document.getElementById('vaciar-carrito');
    const selectCiudad = document.getElementById('ciudad-envio');
    
    // Cargar carrito desde localStorage - FORZAR PARSE CORRECTO
    let carrito = [];
    try {
        const carritoRaw = localStorage.getItem('carrito');
        if (carritoRaw) {
            carrito = JSON.parse(carritoRaw);
            console.log('Carrito cargado correctamente:', carrito);
            console.log('Número de productos:', carrito.length);
        } else {
            console.log('No hay carrito en localStorage');
        }
    } catch (error) {
        console.error('Error al parsear carrito:', error);
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify([]));
    }
    
    // Función para guardar carrito en localStorage
    function guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        console.log('Carrito guardado:', carrito);
        
        // Actualizar badge global si existe
        if (typeof actualizarBadgeCarrito === 'function') {
            actualizarBadgeCarrito();
        }
        
        // También actualizar badge manualmente
        actualizarBadgeManual();
    }
    
    // Actualizar badge manualmente
    function actualizarBadgeManual() {
        const badge = document.querySelector('.cart-badge');
        if (!badge) return;
        
        const totalItems = carrito.reduce((total, producto) => total + (producto.cantidad || 1), 0);
        
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
    
    // Inicializar la página
    renderizarCarrito();
    actualizarTotales();
    actualizarBadgeManual();
    
    // Función principal para renderizar el carrito
    function renderizarCarrito() {
        console.log('Renderizando carrito con', carrito.length, 'productos');
        
        // Limpiar lista
        listaCarrito.innerHTML = '';
        
        // Si el carrito está vacío
        if (carrito.length === 0) {
            listaCarrito.innerHTML = `
                <div class="carrito-vacio" style="text-align: center; padding: 40px; background: #f9f9f9; border-radius: 10px;">
                    <i class="fas fa-shopping-cart" style="font-size: 3em; color: #5A216B; margin-bottom: 20px;"></i>
                    <h3 style="color: #5A216B; margin-bottom: 10px;">Tu carrito está vacío</h3>
                    <p style="color: #666; margin-bottom: 20px;">No hay productos en tu carrito</p>
                    <a href="productos.html" class="btn-comprar" style="display: inline-block; padding: 10px 25px; background: #5A216B; color: white; border-radius: 5px; text-decoration: none; font-weight: bold;">
                        <i class="fas fa-paw"></i> Ver productos
                    </a>
                </div>
            `;
            return;
        }
        
        // Renderizar cada producto
        carrito.forEach((producto, index) => {
            // Asegurar que tenga propiedades requeridas
            const id = producto.id || `prod-${index}`;
            const nombre = producto.name || producto.nombre || 'Producto sin nombre';
            const precio = Number(producto.price || producto.precio || 0);
            const cantidad = Number(producto.cantidad || producto.qty || 1);
            const imagen = producto.image || producto.imagen || 'img/default.jpg';
            const descripcion = producto.description || producto.descripcion || '';
            
            const subtotalProducto = precio * cantidad;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'carrito-item';
            itemDiv.setAttribute('data-id', id);
            itemDiv.setAttribute('data-index', index);
            itemDiv.style.cssText = `
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                margin-bottom: 10px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            `;
            
            itemDiv.innerHTML = `
                <div class="carrito-item-imagen">
                    <img src="${imagen}" 
                         alt="${nombre}" 
                         style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                </div>
                
                <div class="carrito-item-info" style="flex: 1;">
                    <h4 style="margin: 0 0 5px 0; color: #5A216B; font-size: 1.1em;">${nombre}</h4>
                    ${descripcion ? `<p style="margin: 0 0 10px 0; color: #666; font-size: 0.9em;">${descripcion}</p>` : ''}
                    <div style="font-weight: bold; color: #DAA520; font-size: 1.1em;">
                        $${precio.toLocaleString()} c/u
                    </div>
                </div>
                
                <div class="carrito-item-cantidad" style="display: flex; align-items: center; gap: 10px;">
                    <button class="btn-decrementar" data-index="${index}" 
                            style="width: 35px; height: 35px; border-radius: 50%; border: 2px solid #5A216B; background: white; color: #5A216B; cursor: pointer; font-size: 1em;">
                        <i class="fas fa-minus"></i>
                    </button>
                    
                    <span class="cantidad-display" 
                          style="min-width: 40px; text-align: center; font-weight: bold; font-size: 1.1em;">
                        ${cantidad}
                    </span>
                    
                    <button class="btn-incrementar" data-index="${index}" 
                            style="width: 35px; height: 35px; border-radius: 50%; border: 2px solid #5A216B; background: white; color: #5A216B; cursor: pointer; font-size: 1em;">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <div class="carrito-item-subtotal" style="font-weight: bold; color: #5A216B; min-width: 120px; text-align: right; font-size: 1.1em;">
                    $${subtotalProducto.toLocaleString()}
                </div>
                
                <button class="btn-eliminar-item" data-index="${index}" 
                        style="background: #FF4444; color: white; border: none; width: 45px; height: 45px; border-radius: 8px; cursor: pointer; font-size: 1.2em;">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            listaCarrito.appendChild(itemDiv);
        });
        
        // Agregar event listeners a los botones
        agregarEventListenersCarrito();
        
        // Actualizar contador de items
        if (totalItemsElement) {
            totalItemsElement.textContent = carrito.length;
        }
    }
    
    // Función para agregar event listeners
    function agregarEventListenersCarrito() {
        // Botones eliminar
        document.querySelectorAll('.btn-eliminar-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                eliminarDelCarrito(index);
            });
        });
        
        // Botones incrementar
        document.querySelectorAll('.btn-incrementar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                actualizarCantidad(index, 1);
            });
        });
        
        // Botones decrementar
        document.querySelectorAll('.btn-decrementar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                actualizarCantidad(index, -1);
            });
        });
    }
    
    // Función para eliminar un producto
    function eliminarDelCarrito(index) {
        if (index >= 0 && index < carrito.length) {
            const productoEliminado = carrito[index];
            
            // Confirmar eliminación
            if (confirm(`¿Eliminar "${productoEliminado.name || productoEliminado.nombre}" del carrito?`)) {
                // Eliminar del array
                carrito.splice(index, 1);
                
                // Guardar en localStorage
                guardarCarrito();
                
                // Mostrar mensaje
                mostrarMensaje(`"${productoEliminado.name || productoEliminado.nombre}" eliminado del carrito`, 'success');
                
                // Actualizar la vista
                renderizarCarrito();
                actualizarTotales();
            }
        }
    }
    
    // Función para actualizar cantidad
    function actualizarCantidad(index, cambio) {
        if (index >= 0 && index < carrito.length) {
            const producto = carrito[index];
            let nuevaCantidad = (Number(producto.cantidad) || 1) + cambio;
            
            // Validar límites
            if (nuevaCantidad < 1) nuevaCantidad = 1;
            if (nuevaCantidad > 99) nuevaCantidad = 99;
            
            // Actualizar cantidad
            producto.cantidad = nuevaCantidad;
            
            // Guardar en localStorage
            guardarCarrito();
            
            // Actualizar la vista
            renderizarCarrito();
            actualizarTotales();
        }
    }
    
    // Función para vaciar el carrito completo
    if (btnVaciar) {
        btnVaciar.addEventListener('click', function() {
            if (carrito.length === 0) {
                mostrarMensaje('El carrito ya está vacío', 'info');
                return;
            }
            
            if (confirm('¿Estás seguro de vaciar todo el carrito?')) {
                // Vaciar carrito
                carrito = [];
                guardarCarrito();
                
                // Mostrar mensaje
                mostrarMensaje('Carrito vaciado correctamente', 'success');
                
                // Actualizar la vista
                renderizarCarrito();
                actualizarTotales();
            }
        });
    }
    
    // Función para calcular costos de envío
    function calcularCostoEnvio(ciudad) {
        const tarifas = {
            'bogota': 8000,
            'medellin': 7000,
            'cali': 9000,
            'barranquilla': 12000,
            'cartagena': 13000,
            'bucaramanga': 11000,
            'otras': 15000
        };
        return tarifas[ciudad] || 0;
    }
    
    // Función para actualizar totales
    function actualizarTotales() {
        console.log('Actualizando totales...');
        
        // Calcular subtotal
        const subtotal = carrito.reduce((total, producto) => {
            const precio = Number(producto.price || producto.precio || 0);
            const cantidad = Number(producto.cantidad || 1);
            return total + (precio * cantidad);
        }, 0);
        
        // Calcular envío
        let costoEnvio = 0;
        if (selectCiudad && selectCiudad.value) {
            costoEnvio = calcularCostoEnvio(selectCiudad.value);
        }
        
        // Calcular total
        const total = subtotal + costoEnvio;
        
        // Actualizar elementos del DOM
        if (subtotalElement) {
            subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
        }
        
        if (totalPedidoElement) {
            totalPedidoElement.textContent = `$${total.toLocaleString()}`;
        }
        
        // Actualizar costo de envío
        const elementoCostoEnvio = document.getElementById('costo-envio');
        if (elementoCostoEnvio) {
            elementoCostoEnvio.textContent = `$${costoEnvio.toLocaleString()}`;
        }
        
        console.log(`Subtotal: $${subtotal}, Envío: $${costoEnvio}, Total: $${total}`);
    }
    
    // Event listener para cambio de ciudad de envío
    if (selectCiudad) {
        selectCiudad.addEventListener('change', function() {
            console.log('Ciudad cambiada:', this.value);
            actualizarTotales();
        });
    }
    
    // Función para mostrar mensajes
    function mostrarMensaje(mensaje, tipo = 'info') {
        console.log(`Mensaje (${tipo}):`, mensaje);
        
        // Crear elemento de mensaje
        const mensajeDiv = document.createElement('div');
        mensajeDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
        
        // Configurar según tipo
        if (tipo === 'success') {
            mensajeDiv.style.background = '#4CAF50';
            mensajeDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${mensaje}`;
        } else if (tipo === 'error') {
            mensajeDiv.style.background = '#FF4444';
            mensajeDiv.innerHTML = `<i class="fas fa-times-circle"></i> ${mensaje}`;
        } else if (tipo === 'warning') {
            mensajeDiv.style.background = '#FF9800';
            mensajeDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${mensaje}`;
        } else {
            mensajeDiv.style.background = '#5A216B';
            mensajeDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${mensaje}`;
        }
        
        document.body.appendChild(mensajeDiv);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            mensajeDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (mensajeDiv.parentNode) {
                    document.body.removeChild(mensajeDiv);
                }
            }, 300);
        }, 3000);
    }
    
    // Asegurar que existan los estilos de animación
    if (!document.querySelector('#animaciones-carrito-page')) {
        const estilosAnimacion = document.createElement('style');
        estilosAnimacion.id = 'animaciones-carrito-page';
        estilosAnimacion.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(estilosAnimacion);
    }
    
    console.log('=== PÁGINA DEL CARRITO INICIALIZADA ===');
});