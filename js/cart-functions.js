// cart-functions.js - Funciones avanzadas del carrito
class CarritoManager {
    constructor() {
        this.carrito = JSON.parse(localStorage.getItem('pelusaspet_carrito')) || [];
        console.log('CarritoManager inicializado');
    }
    
    // Obtener carrito
    getCarrito() {
        return this.carrito;
    }
    
    // Agregar producto
    agregar(producto) {
        const existente = this.carrito.find(item => item.id === producto.id);
        
        if (existente) {
            existente.cantidad += 1;
        } else {
            this.carrito.push({
                ...producto,
                cantidad: 1,
                fecha: new Date().toISOString()
            });
        }
        
        this.guardar();
        return this.carrito;
    }
    
    // Eliminar producto
    eliminar(id) {
        this.carrito = this.carrito.filter(item => item.id !== id);
        this.guardar();
        return this.carrito;
    }
    
    // Actualizar cantidad
    actualizarCantidad(id, cantidad) {
        const item = this.carrito.find(item => item.id === id);
        if (item && cantidad > 0) {
            item.cantidad = cantidad;
            this.guardar();
        }
        return this.carrito;
    }
    
    // Vaciar carrito
    vaciar() {
        this.carrito = [];
        this.guardar();
        return this.carrito;
    }
    
    // Calcular subtotal
    calcularSubtotal() {
        return this.carrito.reduce((total, item) => 
            total + (item.price * item.cantidad), 0);
    }
    
    // Guardar en localStorage
    guardar() {
        localStorage.setItem('pelusaspet_carrito', JSON.stringify(this.carrito));
        this.actualizarBadge();
    }
    
    // Actualizar badge
    actualizarBadge() {
        const totalItems = this.carrito.reduce((sum, item) => sum + item.cantidad, 0);
        const badges = document.querySelectorAll('.cart-badge');
        
        badges.forEach(badge => {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        });
        
        return totalItems;
    }
    
    // Exportar carrito (para backup)
    exportarCarrito() {
        return JSON.stringify(this.carrito);
    }
    
    // Importar carrito (para restaurar)
    importarCarrito(datos) {
        try {
            this.carrito = JSON.parse(datos);
            this.guardar();
            return true;
        } catch (error) {
            console.error('Error importando carrito:', error);
            return false;
        }
    }
}

// Crear instancia global (opcional)
if (typeof window.carritoManager === 'undefined') {
    window.carritoManager = new CarritoManager();
}