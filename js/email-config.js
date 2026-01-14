// email-config.js - Configuración de emails
const EmailConfig = {
    // === REEMPLAZA CON TU ENDPOINT DE FORMSFREE ===
    FORMSFREE_ENDPOINT: 'https://formspree.io/f/xrebnwej',
    
    // Emails de la empresa
    COMPANY_EMAILS: {
        ventas: 'ventas@pelusaspet.com',
        soporte: 'soporte@pelusaspet.com',
        info: 'info@pelusaspet.com'
    },
    
    // Plantillas de email
    TEMPLATES: {
        order_confirmation: {
            subject: 'Confirmación de Pedido #{pedido_id} - PelusasPet',
            body: `Estimado/a {cliente_nombre},

¡Gracias por tu pedido en PelusasPet! 

Detalles de tu pedido #{pedido_id}:
{productos_list}

Total: ${total}

Dirección de envío:
{cliente_direccion}
{cliente_ciudad}

Estado: Pendiente de pago

Sigue estos pasos para completar tu pedido:
1. Realiza el pago según el método seleccionado
2. Envía el comprobante por WhatsApp
3. Confirmaremos tu pedido en menos de 24 horas

¿Preguntas? Escríbenos por WhatsApp.

¡Gracias por confiar en PelusasPet! 🐾`
        }
    }
};

// Hacer disponible globalmente
window.EmailConfig = EmailConfig;