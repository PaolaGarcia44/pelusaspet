// Reemplaza la función de procesar pago en carrito-page.js
async function procesarPagoWompi(pedido) {
    try {
        // Mostrar loading
        const btnPagar = document.getElementById('btn-pagar');
        const originalText = btnPagar.innerHTML;
        btnPagar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando pago...';
        btnPagar.disabled = true;
        
        // Cargar Wompi si no está cargado
        if (!window.wompiCheckout) {
            const script = document.createElement('script');
            script.src = 'js/wompi-checkout.js';
            document.head.appendChild(script);
            
            // Esperar a que cargue
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Enviar notificación por WhatsApp
        enviarNotificacionWhatsApp(pedido);
        
        // Crear transacción en Wompi
        const transaction = await window.wompiCheckout.createTransaction(pedido);
        
        // Guardar pedido localmente
        guardarPedidoLocal(pedido);
        
        // El widget de Wompi se encarga de la redirección
        return true;
        
    } catch (error) {
        console.error('Error en pago Wompi:', error);
        alert('Error al procesar el pago. Por favor, intenta nuevamente.');
        
        // Restaurar botón
        const btnPagar = document.getElementById('btn-pagar');
        btnPagar.innerHTML = originalText;
        btnPagar.disabled = false;
        
        return false;
    }
}

// En el submit del formulario, cambia a:
if (formularioCheckout) {
    formularioCheckout.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // [Mantén todas las validaciones anteriores...]
        
        // Crear pedido
        const pedido = {
            id: 'PED_' + Date.now(),
            fecha: new Date().toISOString(),
            cliente: datosCliente,
            productos: [...carrito],
            subtotal: subtotalCalculado,
            envio: envio,
            total: total,
            estado: 'pendiente_pago',
            metodo_pago: 'wompi'
        };
        
        // Procesar con Wompi
        await procesarPagoWompi(pedido);
    });
}

/// En carrito-page.js, actualiza el submit
if (formularioCheckout) {
    formularioCheckout.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (carrito.length === 0) {
            alert('Tu carrito está vacío. Agrega productos antes de proceder al pago.');
            return;
        }
        
        const datosCliente = {
            nombre: document.getElementById('nombre').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
            direccion: document.getElementById('direccion').value,
            ciudad: document.getElementById('ciudad').value,
            codigoPostal: document.getElementById('codigo-postal').value,
            notas: document.getElementById('notas').value
        };
        
        // Validaciones
        const errores = [];
        if (!datosCliente.nombre) errores.push('Nombre completo');
        if (!datosCliente.telefono) errores.push('Teléfono');
        if (!datosCliente.email) errores.push('Email');
        if (!datosCliente.direccion) errores.push('Dirección');
        if (!datosCliente.ciudad) errores.push('Ciudad');
        
        if (errores.length > 0) {
            alert(`Por favor completa: ${errores.join(', ')}`);
            return;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datosCliente.email)) {
            alert('Por favor ingresa un email válido');
            return;
        }
        
        // Validar teléfono
        const telefonoLimpio = datosCliente.telefono.replace(/\D/g, '');
        if (telefonoLimpio.length < 10) {
            alert('Por favor ingresa un teléfono válido (10 dígitos)');
            return;
        }
        
        // Calcular total
        const ciudad = selectCiudad ? selectCiudad.value : 'otras';
        const subtotalCalculado = carrito.reduce((total, item) => 
            total + (item.price * item.cantidad), 0);
        const envio = calcularEnvio(ciudad);
        const total = subtotalCalculado + envio;
        
        // Crear pedido
        const pedido = {
            id: 'PED_' + Date.now(),
            fecha: new Date().toISOString(),
            cliente: datosCliente,
            productos: [...carrito],
            subtotal: subtotalCalculado,
            envio: envio,
            total: total,
            estado: 'pendiente_pago',
            metodo_pago_seleccionado: document.querySelector('input[name="payment-method"]:checked').value
        };
        
        // Procesar con PaymentManager
        await procesarConPaymentManager(pedido);
    });
}

async function procesarConPaymentManager(pedido) {
    try {
        const btnPagar = document.getElementById('btn-pagar');
        const originalText = btnPagar.innerHTML;
        btnPagar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        btnPagar.disabled = true;
        
        // Cargar PaymentManager si no está
        if (!window.paymentManager) {
            const script = document.createElement('script');
            script.src = 'js/payment-manager.js';
            document.head.appendChild(script);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Procesar pago
        const resultado = await window.paymentManager.processPayment(pedido);
        
        console.log('Pago procesado:', resultado);
        
        // Para Nequi, ya se mostró el modal
        // Para Wompi, se redirigirá automáticamente
        
    } catch (error) {
        console.error('Error procesando pago:', error);
        alert('Error: ' + error.message);
        
        const btnPagar = document.getElementById('btn-pagar');
        btnPagar.innerHTML = originalText;
        btnPagar.disabled = false;
    }
}