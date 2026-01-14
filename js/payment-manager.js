// payment-manager.js - Gestor completo de pagos
class PaymentManager {
    constructor() {
        console.log('PaymentManager inicializado');
        this.currentMethod = null;
        this.pedidoActual = null;
        
        // Métodos disponibles (se cargan dinámicamente)
        this.methods = {
            'nequi': {
                name: 'Nequi/Daviplata',
                icon: 'fas fa-mobile-alt',
                color: '#25D366',
                enabled: true
            },
            'wompi_card': {
                name: 'Tarjeta Crédito/Débito',
                icon: 'fas fa-credit-card',
                color: '#5A216B',
                enabled: false // Se activa al configurar Wompi
            },
            'wompi_pse': {
                name: 'PSE (Transferencia)',
                icon: 'fas fa-university',
                color: '#0033A0',
                enabled: false
            },
            'paypal': {
                name: 'PayPal',
                icon: 'fab fa-paypal',
                color: '#003087',
                enabled: false
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('Inicializando PaymentManager');
        this.setupEventListeners();
        this.checkSavedSettings();
    }
    
    setupEventListeners() {
        // Escuchar cambios en método de pago
        document.addEventListener('change', (e) => {
            if (e.target.name === 'payment-method') {
                this.selectPaymentMethod(e.target.value);
            }
        });
    }
    
    checkSavedSettings() {
        // Verificar si hay métodos guardados
        const savedMethods = localStorage.getItem('pelusaspet_payment_methods');
        if (savedMethods) {
            this.methods = { ...this.methods, ...JSON.parse(savedMethods) };
        }
    }
    
    selectPaymentMethod(methodId) {
        this.currentMethod = methodId;
        console.log(`Método seleccionado: ${methodId}`);
        
        // Actualizar UI si existe
        this.updateMethodDisplay();
        
        // Guardar preferencia
        localStorage.setItem('pelusaspet_last_payment_method', methodId);
    }
    
    updateMethodDisplay() {
        const method = this.methods[this.currentMethod];
        if (!method) return;
        
        const display = document.getElementById('payment-method-display');
        if (display) {
            display.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: ${method.color}10; border-radius: 8px; border-left: 4px solid ${method.color};">
                    <i class="${method.icon}" style="color: ${method.color}; font-size: 1.5em;"></i>
                    <div>
                        <strong>${method.name}</strong>
                        <small style="display: block; color: #666;">Método seleccionado</small>
                    </div>
                </div>
            `;
        }
    }
    
    // Procesar pago según método
    async processPayment(pedidoData) {
        if (!this.currentMethod) {
            throw new Error('Por favor selecciona un método de pago');
        }
        
        this.pedidoActual = pedidoData;
        
        switch(this.currentMethod) {
            case 'nequi':
                return await this.processNequiPayment(pedidoData);
                
            case 'wompi_card':
            case 'wompi_pse':
                return await this.processWompiPayment(pedidoData);
                
            case 'paypal':
                return await this.processPayPalPayment(pedidoData);
                
            default:
                throw new Error('Método de pago no implementado');
        }
    }
    
    // Procesar pago con Nequi
    async processNequiPayment(pedidoData) {
        console.log('Procesando pago Nequi:', pedidoData);
        
        // 1. Generar datos del pago
        const paymentData = this.generateNequiPaymentData(pedidoData);
        
        // 2. Mostrar modal con instrucciones
        this.showNequiInstructions(paymentData);
        
        // 3. Guardar pedido como pendiente
        this.savePendingOrder(pedidoData);
        
        // 4. Enviar notificaciones
        await this.sendPaymentNotifications(pedidoData, 'nequi');
        
        return {
            success: true,
            type: 'nequi',
            data: paymentData,
            message: 'Instrucciones de pago generadas'
        };
    }
    
    generateNequiPaymentData(pedidoData) {
        const nequiNumber = '573197622653'; // Tu número Nequi
        const total = pedidoData.total;
        const referencia = pedidoData.id;
        
        // Mensaje para WhatsApp
        const whatsappMessage = `💸 *SOLICITUD DE PAGO NEQUI - PELUSASPET*

📋 Pedido #${referencia}
👤 Cliente: ${pedidoData.cliente.nombre}
📱 Teléfono: ${pedidoData.cliente.telefono}
💰 Total a pagar: $${total.toLocaleString()}

📦 *Productos:*
${pedidoData.productos.map(p => `• ${p.name} x${p.cantidad}`).join('\n')}

🔢 *PARA PAGAR:*
1. Abre Nequi/Daviplata
2. Envía $${total.toLocaleString()} al número: ${nequiNumber}
3. En concepto escribe: "Pedido ${referencia}"
4. Guarda el comprobante
5. Envíanoslo por este chat

📍 *DATOS DE ENVÍO:*
${pedidoData.cliente.direccion}
${pedidoData.cliente.ciudad}

✅ *Tu pedido será procesado una vez confirmemos el pago.*`;
        
        // Generar QR
        const qrData = `Nequi:${nequiNumber}?amount=${total}&message=Pedido ${referencia}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
        
        // Enlace directo a Nequi
        const nequiLink = `https://api.whatsapp.com/send?phone=${nequiNumber}&text=${encodeURIComponent(`Quiero pagar el pedido ${referencia} de $${total}`)}`;
        
        return {
            nequiNumber,
            total,
            referencia,
            whatsappMessage,
            qrUrl,
            nequiLink,
            pedidoId: pedidoData.id
        };
    }
    
    showNequiInstructions(paymentData) {
        // Crear modal
        const modal = document.createElement('div');
        modal.id = 'nequi-payment-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
            backdrop-filter: blur(5px);
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 15px; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #25D366, #128C7E); color: white; padding: 25px; border-radius: 15px 15px 0 0; text-align: center;">
                    <i class="fas fa-mobile-alt" style="font-size: 3em; margin-bottom: 15px;"></i>
                    <h2 style="margin: 0; font-size: 1.8em;">Pago con Nequi/Daviplata</h2>
                    <p style="opacity: 0.9; margin-top: 5px;">Sigue estos pasos para completar tu pago</p>
                </div>
                
                <!-- Contenido -->
                <div style="padding: 25px;">
                    <!-- Paso 1 -->
                    <div style="margin-bottom: 25px;">
                        <h3 style="color: #5A216B; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                            <span style="background: #5A216B; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">1</span>
                            Transfiere el monto
                        </h3>
                        <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; text-align: center;">
                            <p style="margin: 0 0 15px 0; font-size: 1.1em;">
                                Envía <strong>$${paymentData.total.toLocaleString()}</strong> a:
                            </p>
                            <div style="background: white; padding: 15px; border-radius: 8px; border: 2px dashed #25D366; margin-bottom: 15px;">
                                <code style="font-size: 1.4em; color: #25D366; font-weight: bold;">${paymentData.nequiNumber}</code>
                            </div>
                            <p style="color: #666; font-size: 0.9em;">
                                Concepto: <strong>Pedido ${paymentData.referencia}</strong>
                            </p>
                        </div>
                    </div>
                    
                    <!-- Paso 2 -->
                    <div style="margin-bottom: 25px;">
                        <h3 style="color: #5A216B; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                            <span style="background: #5A216B; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">2</span>
                            Escanea el código QR
                        </h3>
                        <div style="text-align: center;">
                            <img src="${paymentData.qrUrl}" alt="QR para pago" style="width: 200px; height: 200px; border: 1px solid #ddd; border-radius: 10px; padding: 10px;">
                            <p style="color: #666; margin-top: 10px; font-size: 0.9em;">
                                Escanea con tu app de Nequi
                            </p>
                        </div>
                    </div>
                    
                    <!-- Paso 3 -->
                    <div style="margin-bottom: 25px;">
                        <h3 style="color: #5A216B; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                            <span style="background: #5A216B; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">3</span>
                            Envía el comprobante
                        </h3>
                        <div style="text-align: center;">
                            <a href="${paymentData.nequiLink}" 
                               target="_blank"
                               style="display: inline-flex; align-items: center; gap: 10px; background: #25D366; color: white; padding: 15px 25px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 1.1em;">
                                <i class="fab fa-whatsapp"></i>
                                Enviar comprobante por WhatsApp
                            </a>
                            <p style="color: #666; margin-top: 15px; font-size: 0.9em;">
                                Tu pedido se procesará al confirmar el pago
                            </p>
                        </div>
                    </div>
                    
                    <!-- Información adicional -->
                    <div style="background: #FFF3CD; border-left: 4px solid #FFC107; padding: 15px; border-radius: 0 8px 8px 0; margin-top: 20px;">
                        <p style="margin: 0; color: #856404; font-size: 0.9em;">
                            <i class="fas fa-info-circle"></i> 
                            <strong>Importante:</strong> Guarda el comprobante. Te contactaremos en menos de 24 horas para confirmar tu pedido.
                        </p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="padding: 20px 25px; background: #f9f9f9; border-radius: 0 0 15px 15px; display: flex; justify-content: space-between; align-items: center;">
                    <button onclick="document.getElementById('nequi-payment-modal').remove(); localStorage.setItem('pelusaspet_last_pedido', '${paymentData.pedidoId}');" 
                            style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                        Cerrar
                    </button>
                    <a href="/gracias.html?pedido=${paymentData.pedidoId}&status=pending" 
                       style="background: linear-gradient(135deg, #5A216B, #DAA520); color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
                        Ver resumen del pedido
                    </a>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
        
        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        });
    }
    
    savePendingOrder(pedidoData) {
        const pedido = {
            ...pedidoData,
            estado: 'pendiente_pago_nequi',
            fecha_pago_pendiente: new Date().toISOString(),
            metodo_pago: 'nequi'
        };
        
        // Guardar en localStorage
        const pedidos = JSON.parse(localStorage.getItem('pelusaspet_pedidos')) || [];
        pedidos.push(pedido);
        localStorage.setItem('pelusaspet_pedidos', JSON.stringify(pedidos));
        
        // Vaciar carrito
        localStorage.setItem('pelusaspet_carrito', JSON.stringify([]));
        
        // Actualizar badge
        this.updateCartBadge(0);
        
        console.log('Pedido guardado como pendiente:', pedido.id);
    }
    
    updateCartBadge(count) {
        const badges = document.querySelectorAll('.cart-badge');
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }
    
    async sendPaymentNotifications(pedidoData, method) {
        try {
            // 1. WhatsApp al cliente
            await this.sendWhatsAppToCustomer(pedidoData, method);
            
            // 2. WhatsApp/Email a la empresa
            await this.sendNotificationToBusiness(pedidoData, method);
            
            // 3. Email al cliente (si está configurado)
            if (window.emailService) {
                await window.emailService.enviarEmailCliente(pedidoData);
            }
            
            return true;
            
        } catch (error) {
            console.error('Error enviando notificaciones:', error);
            return false;
        }
    }
    
    async sendWhatsAppToCustomer(pedidoData, method) {
        const phone = pedidoData.cliente.telefono.replace(/\D/g, '');
        const message = this.generateCustomerWhatsAppMessage(pedidoData, method);
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        
        // Abrir en nueva pestaña
        window.open(url, '_blank');
        
        return true;
    }
    
    generateCustomerWhatsAppMessage(pedidoData, method) {
        return `¡Hola ${pedidoData.cliente.nombre}! 👋

🎉 *¡Tu pedido en PelusasPet ha sido recibido!*

📋 *Detalles del pedido #${pedidoData.id}:*
${pedidoData.productos.map(p => `• ${p.name} x${p.cantidad} - $${(p.price * p.cantidad).toLocaleString()}`).join('\n')}

💰 *Resumen de pago:*
Subtotal: $${pedidoData.subtotal.toLocaleString()}
Envío: $${pedidoData.envio.toLocaleString()}
*Total: $${pedidoData.total.toLocaleString()}*

📍 *Dirección de envío:*
${pedidoData.cliente.direccion}
${pedidoData.cliente.ciudad}

📦 *Estado:* Pendiente de pago (${method === 'nequi' ? 'Nequi/Daviplata' : method})

💡 *Próximos pasos:*
1. Realiza el pago según las instrucciones
2. Envía el comprobante por este chat
3. Confirmaremos tu pedido en menos de 24h

❓ *¿Preguntas?* Estamos aquí para ayudarte.

¡Gracias por confiar en PelusasPet! 🐾`;
    }
    
    async sendNotificationToBusiness(pedidoData, method) {
        const businessPhone = '573197622653'; // Tu número
        const message = this.generateBusinessNotificationMessage(pedidoData, method);
        const url = `https://wa.me/${businessPhone}?text=${encodeURIComponent(message)}`;
        
        // Guardar para enviar manualmente
        this.saveBusinessNotification(message);
        
        return true;
    }
    
    generateBusinessNotificationMessage(pedidoData, method) {
        return `🚨 *NUEVO PEDIDO PENDIENTE - #${pedidoData.id}*

👤 *Cliente:* ${pedidoData.cliente.nombre}
📱 *Teléfono:* ${pedidoData.cliente.telefono}
📧 *Email:* ${pedidoData.cliente.email}
📍 *Dirección:* ${pedidoData.cliente.direccion}
🏙️ *Ciudad:* ${pedidoData.cliente.ciudad}

💰 *Total:* $${pedidoData.total.toLocaleString()}
💳 *Método:* ${method === 'nequi' ? 'Nequi/Daviplata' : method}

📦 *Productos:*
${pedidoData.productos.map(p => `• ${p.name} x${p.cantidad}`).join('\n')}

⏰ *Fecha:* ${new Date().toLocaleString('es-ES')}

⚠️ *ACCIÓN REQUERIDA:*
• Esperar comprobante de pago del cliente
• Confirmar disponibilidad de productos
• Preparar envío una vez confirmado pago

✅ *ENLACES:*
• Ver pedido: https://tudominio.com/admin.html?pedido=${pedidoData.id}
• Contactar: https://wa.me/${pedidoData.cliente.telefono}`;
    }
    
    saveBusinessNotification(message) {
        const notifications = JSON.parse(localStorage.getItem('pelusaspet_business_notifications')) || [];
        notifications.push({
            message,
            fecha: new Date().toISOString(),
            leida: false
        });
        localStorage.setItem('pelusaspet_business_notifications', JSON.stringify(notifications));
    }
    
    // Métodos para otros tipos de pago
    async processWompiPayment(pedidoData) {
        // Implementación Wompi
        console.log('Procesando Wompi:', pedidoData);
        
        if (!window.wompiCheckout) {
            await this.loadWompiCheckout();
        }
        
        return await window.wompiCheckout.createTransaction(pedidoData);
    }
    
    async loadWompiCheckout() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/js/wompi-checkout.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    async processPayPalPayment(pedidoData) {
        // Implementación PayPal
        console.log('Procesando PayPal:', pedidoData);
        throw new Error('PayPal no implementado aún');
    }
    
    // Configurar métodos
    configureMethod(methodId, config) {
        if (this.methods[methodId]) {
            this.methods[methodId] = { ...this.methods[methodId], ...config, enabled: true };
            localStorage.setItem('pelusaspet_payment_methods', JSON.stringify(this.methods));
            console.log(`Método ${methodId} configurado:`, config);
            return true;
        }
        return false;
    }
    
    // Obtener métodos disponibles
    getAvailableMethods() {
        return Object.entries(this.methods)
            .filter(([id, method]) => method.enabled)
            .map(([id, method]) => ({ id, ...method }));
    }
}

// Inicializar automáticamente
if (typeof window.paymentManager === 'undefined') {
    window.paymentManager = new PaymentManager();
    console.log('PaymentManager creado globalmente');
}