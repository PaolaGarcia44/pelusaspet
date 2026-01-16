// script.js - Script principal para TODAS las páginas de PelusasPet
document.addEventListener('DOMContentLoaded', function() {
    console.log('PelusasPet - DOM cargado ✓');
    
    // ========== 1. MENÚ HAMBURGUESA ==========
    const hamburger = document.getElementById('hamburger');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburger && mobileMenu) {
        console.log('Menú hamburguesa detectado');
        
        // Abrir menú
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Menú abierto');
        });
        
        // Función para cerrar menú
        function cerrarMenu() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Menú cerrado');
        }
        
        // Cerrar con botón X
        if (closeMenu) {
            closeMenu.addEventListener('click', cerrarMenu);
        }
        
        // Cerrar al hacer clic fuera del menú
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                cerrarMenu();
            }
        });
        
        // Cerrar con tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                cerrarMenu();
            }
        });
        
        // Cerrar al hacer clic en enlaces del menú (móvil)
        const mobileLinks = document.querySelectorAll('.mobile-nav a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', cerrarMenu);
        });
    } else {
        console.warn('Elementos del menú móvil no encontrados');
    }
    
    // ========== 2. SISTEMA DE CARRITO UNIFICADO ==========
    function actualizarBadgeCarrito() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            // CLAVE UNIFICADA: 'carrito' (NO 'pelusaspet_carrito')
            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 0), 0);
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
            console.log(`Badge actualizado: ${totalItems} items (clave: carrito)`);
        }
    }
    
    // Inicializar badge al cargar
    actualizarBadgeCarrito();
    
    // ========== 3. ICONO CARRITO CLICKEABLE ==========
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'carrito.html';
        });
    }
    
    // ========== 4. FUNCIÓN PARA AGREGAR AL CARRITO (UNIFICADA) ==========
    window.agregarAlCarritoOriginal = function(productoId) {
        console.log(`Agregando producto: ${productoId}`);
        
        // CATÁLOGO COMPLETO DE PRODUCTOS (para index.html y productos.html)
        const productos = {
            // Productos de index.html
            'shampoo-romero': {
                id: 'shampoo-romero',
                name: 'Shampoo de Romero y Avena',
                price: 29900,
                image: 'img/shampoo-romero.webp',
                description: 'Alivia la picazón, hidrata profundamente y fortalece el pelo de forma 100% natural.'
            },
            'crema-hidratante': {
                id: 'crema-hidratante',
                name: 'Crema Hidratante Vitaminas A, E y F',
                price: 34900,
                image: 'img/crema-hidratante.webp',
                description: 'Repara y protege la piel seca o irritada de tu mascota.'
            },
            'crema-antialergias': {
                id: 'crema-antialergias',
                name: 'Crema Antialergias',
                price: 27900,
                image: 'img/antihongos.webp',
                description: 'Alivia alergias y protege la piel sensible de tu mascota.'
            },
            
            // Productos de productos.html
            'shampoo-manzanilla': { 
                id: 'shampoo-manzanilla', 
                name: 'Shampoo Manzanilla', 
                price: 29900, 
                image: 'img/default.jpg',
                description: 'Shampoo suave de manzanilla para pieles sensibles.'
            },
            'perfume-floral': { 
                id: 'perfume-floral', 
                name: 'Perfume Floral', 
                price: 24900, 
                image: 'img/locion-floral.webp',
                description: 'Perfume floral natural de lavanda.'
            },
            'estimulante-sensorial': { 
                id: 'estimulante-sensorial', 
                name: 'Estimulante Sensorial', 
                price: 32900, 
                image: 'img/sensorial.webp',
                description: 'Promueve el bienestar emocional de tu mascota.'
            },
            'antipulgas-natural': { 
                id: 'antipulgas-natural', 
                name: 'Antipulgas Natural', 
                price: 26900, 
                image: 'img/antipulgas.webp',
                description: 'Protege a tu mascota de pulgas y garrapatas de forma natural.'
            },
            'perfume-manzana-verde': { 
                id: 'perfume-manzana-verde', 
                name: 'Perfume Manzana Verde', 
                price: 24900, 
                image: 'img/perfume-manzana.webp',
                description: 'Perfume natural de manzana verde.'
            },
            'perfume-kiwi': { 
                id: 'perfume-kiwi', 
                name: 'Perfume Kiwi', 
                price: 24900, 
                image: 'img/locion-kiwi.webp',
                description: 'Perfume natural de kiwi.'
            },
            'combo-zeus': { 
                id: 'combo-zeus', 
                name: 'Combo Zeus', 
                price: 59900, 
                image: 'img/combo-zeus.webp',
                description: 'Para peludos con piel sensible o problemas en su piel.'
            },
            'combo-rocky': { 
                id: 'combo-rocky', 
                name: 'Combo Rocky', 
                price: 54900, 
                image: 'img/combo-rocky.webp',
                description: 'Para peludos con piel normal.'
            },
            'combo-scooby': { 
                id: 'combo-scooby', 
                name: 'Combo Scooby', 
                price: 64900, 
                image: 'img/combo-scooby.webp',
                description: 'Para razas grandes.'
            }
        };
        
        const producto = productos[productoId] || { 
            id: productoId, 
            name: 'Producto ' + productoId, 
            price: 20000,
            image: 'img/default.jpg',
            description: 'Producto de calidad para tu mascota.'
        };
        
        // USAR CLAVE UNIFICADA: 'carrito'
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const itemExistente = carrito.find(item => item.id === productoId);
        
        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        // GUARDAR CON CLAVE UNIFICADA: 'carrito'
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarBadgeCarrito();
        
        // Disparar evento para sincronización
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'carrito',
            newValue: JSON.stringify(carrito)
        }));
        
        // Mostrar notificación
        mostrarNotificacion(`${producto.name} añadido al carrito`);
        
        // Animación del botón (si existe)
        if (event && event.target) {
            const boton = event.target;
            const textoOriginal = boton.innerHTML;
            boton.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
            boton.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                boton.innerHTML = textoOriginal;
                boton.style.backgroundColor = '';
            }, 1500);
        }
        
        return carrito;
    };
    
    // Alias para compatibilidad
    window.agregarAlCarrito = window.agregarAlCarritoOriginal;
    
    // ========== 5. FORMULARIO MAYORISTA ==========
    const wholesaleForm = document.getElementById('wholesaleForm');
    if (wholesaleForm) {
        console.log('Formulario mayorista detectado');
        
        wholesaleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulario mayorista enviado');
            
            // Recoger datos
            const formData = {
                empresa: document.getElementById('businessName').value,
                tipoNegocio: document.getElementById('businessType').value,
                contacto: document.getElementById('contactPerson').value,
                telefono: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                ciudad: document.getElementById('location').value,
                productos: Array.from(document.querySelectorAll('input[name="products[]"]:checked'))
                            .map(cb => cb.value),
                volumen: document.getElementById('quantity').value,
                mensaje: document.getElementById('message').value
            };
            
            // Validación básica
            if (!formData.empresa || !formData.contacto || !formData.telefono) {
                alert('Por favor completa los campos obligatorios');
                return;
            }
            
            // Generar mensaje para WhatsApp
            const mensajeWhatsApp = `🚀 *NUEVA SOLICITUD MAYORISTA PELUSASPET* 

🏢 *Empresa:* ${formData.empresa}
📋 *Tipo:* ${formData.tipoNegocio}
👤 *Contacto:* ${formData.contacto}
📱 *Teléfono:* ${formData.telefono}
📧 *Email:* ${formData.email || 'No especificado'}
📍 *Ubicación:* ${formData.ciudad}

🛍️ *Productos de interés:*
${formData.productos.length > 0 ? formData.productos.map(p => `• ${p}`).join('\n') : '• Todos los productos'}

📊 *Volumen:* ${formData.volumen}
📝 *Mensaje adicional:* ${formData.mensaje || 'Ninguno'}

⚠️ *URGENTE:* Contactar para ofrecer precios mayoristas`;
            
            // Codificar mensaje
            const mensajeCodificado = encodeURIComponent(mensajeWhatsApp);
            const numeroWhatsApp = '573197622653';
            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
            
            // Mostrar confirmación
            if (confirm('¿Deseas enviar la solicitud por WhatsApp?')) {
                window.open(urlWhatsApp, '_blank');
                
                // Resetear formulario
                wholesaleForm.reset();
                
                // Mostrar mensaje de éxito
                mostrarNotificacion('¡Solicitud enviada! Te contactaremos pronto.');
            }
        });
    }
    
    // ========== 6. FUNCIÓN DE NOTIFICACIONES ==========
    function mostrarNotificacion(mensaje) {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = 'cart-notification';
        notificacion.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${mensaje}</span>
        `;
        
        document.body.appendChild(notificacion);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notificacion.classList.add('hide');
            setTimeout(() => notificacion.remove(), 300);
        }, 3000);
    }
    
    // ========== 7. SINCRONIZACIÓN ENTRE PESTAÑAS ==========
    function configurarSincronizacionCarrito() {
        console.log('Configurando sincronización entre pestañas...');
        
        // Función local para actualizar badge
        function actualizarBadgeLocal() {
            const badge = document.querySelector('.cart-badge');
            if (badge) {
                // CLAVE UNIFICADA: 'carrito'
                const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 0), 0);
                badge.textContent = totalItems;
                badge.style.display = totalItems > 0 ? 'flex' : 'none';
                console.log(`Sincronización: Badge actualizado: ${totalItems} items`);
            }
        }
        
        // Escuchar cambios en localStorage de otras pestañas
        window.addEventListener('storage', function(event) {
            console.log('Evento storage detectado:', event.key);
            
            // CLAVE UNIFICADA: 'carrito'
            if (event.key === 'carrito') {
                console.log('Carrito modificado en otra pestaña');
                
                // Actualizar el badge del carrito
                actualizarBadgeLocal();
                
                // Si estamos en la página del carrito, recargar la lista
                if (window.location.pathname.includes('carrito')) {
                    // Forzar recarga suave del carrito
                    if (typeof renderizarCarrito === 'function') {
                        console.log('Recargando carrito desde storage event...');
                        // Recargar el carrito después de un breve delay
                        setTimeout(() => {
                            const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
                            console.log('Carrito actualizado:', carritoActual);
                        }, 100);
                    }
                }
            }
        });
        
        // Actualizar periódicamente (cada segundo)
        setInterval(actualizarBadgeLocal, 1000);
        
        console.log('Sincronización configurada ✓');
    }
    
    // Configurar sincronización
    configurarSincronizacionCarrito();
    
    // ========== 8. VERIFICAR Y CORREGIR HUELLITAS ==========
    function verificarHuellitas() {
        console.log('Verificando huellitas...');
        
        const footprintsTracker = document.querySelector('.footprints-tracker');
        if (!footprintsTracker) {
            console.warn('No se encontró .footprints-tracker en el HTML');
            return;
        }
        
        console.log('Footprints tracker encontrado ✓');
        
        const footprints = footprintsTracker.querySelectorAll('.footprint-track');
        console.log(`Número de huellitas: ${footprints.length}`);
    }
    
    // Verificar después de un breve delay
    setTimeout(verificarHuellitas, 100);
    
    // ========== 9. MIGRAR DATOS VIEJOS (si existen) ==========
    function migrarDatosCarritoViejo() {
        const carritoViejo = localStorage.getItem('pelusaspet_carrito');
        const carritoNuevo = localStorage.getItem('carrito');
        
        if (carritoViejo && !carritoNuevo) {
            console.log('Migrando datos de pelusaspet_carrito a carrito...');
            localStorage.setItem('carrito', carritoViejo);
            localStorage.removeItem('pelusaspet_carrito');
            console.log('Migración completada ✓');
        } else if (carritoViejo && carritoNuevo) {
            console.log('Eliminando clave vieja pelusaspet_carrito...');
            localStorage.removeItem('pelusaspet_carrito');
        }
    }
    
    migrarDatosCarritoViejo();
    
    console.log('Script.js inicializado correctamente');
});

// ========== 10. ESTILOS PARA NOTIFICACIÓN ==========
const style = document.createElement('style');
style.textContent = `
    .cart-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--morado), var(--morado-oscuro));
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 350px;
    }
    
    .cart-notification.hide {
        animation: slideOut 0.3s ease forwards;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .cart-notification i {
        font-size: 1.2em;
        color: var(--dorado);
    }
    
    .cart-notification span {
        font-size: 0.9em;
        line-height: 1.4;
    }
`;

document.head.appendChild(style);