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
    
    // ========== 2. SISTEMA DE CARRITO BÁSICO ==========
    function actualizarBadgeCarrito() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            const carrito = JSON.parse(localStorage.getItem('pelusaspet_carrito')) || [];
            const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 0), 0);
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
            console.log(`Badge actualizado: ${totalItems} items`);
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
    
    // ========== 4. FUNCIÓN PARA AGREGAR AL CARRITO ==========
    window.agregarAlCarrito = function(productoId) {
        console.log(`Agregando producto: ${productoId}`);
        
        // Productos base (puedes expandir esto)
        const productos = {
            'shampoo-romero': {
                id: 'shampoo-romero',
                name: 'Shampoo de Romero y Avena',
                price: 29900,
                image: 'img/shampoo-romero.webp'
            },
            'crema-hidratante': {
                id: 'crema-hidratante',
                name: 'Crema Hidratante Vitamina A, E y F',
                price: 34900,
                image: 'img/crema-hidratante.webp'
            },
            'crema-antialergias': {
                id: 'crema-antialergias',
                name: 'Crema Antialergias',
                price: 27900,
                image: 'img/antihongos.webp'
            }
        };
        
        const producto = productos[productoId];
        if (!producto) {
            console.error(`Producto ${productoId} no encontrado`);
            return;
        }
        
        let carrito = JSON.parse(localStorage.getItem('pelusaspet_carrito')) || [];
        const itemExistente = carrito.find(item => item.id === productoId);
        
        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        localStorage.setItem('pelusaspet_carrito', JSON.stringify(carrito));
        actualizarBadgeCarrito();
        
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
    };
    
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
    
    // ========== 7. INICIALIZACIÓN FINAL ==========
    console.log('Script.js inicializado correctamente');
});