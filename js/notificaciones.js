// notifications.js - Sistema de notificaciones
class NotificationManager {
    constructor() {
        console.log('NotificationManager inicializado');
    }
    
    // Mostrar notificación
    show(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    'fa-info-circle';
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        // Estilos
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            animation: notificationSlideIn 0.3s ease;
            color: white;
            max-width: 300px;
        `;
        
        // Colores según tipo
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #FF4444, #CC0000)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #2196F3, #0D47A1)';
        }
        
        document.body.appendChild(notification);
        
        // Remover después del tiempo
        setTimeout(() => {
            notification.style.animation = 'notificationSlideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
    
    // Mostrar éxito
    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }
    
    // Mostrar error
    error(message, duration = 3000) {
        this.show(message, 'error', duration);
    }
    
    // Mostrar información
    info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }
}

// Instancia global
if (typeof window.notificationManager === 'undefined') {
    window.notificationManager = new NotificationManager();
    
    // Agregar estilos CSS para animaciones
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes notificationSlideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes notificationSlideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
}