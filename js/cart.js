// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartUI();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('pelusaspet_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('pelusaspet_cart', JSON.stringify(this.items));
    }

    // Add item to cart
    addItem(productId) {
        const product = getProductById(productId);
        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                icon: product.icon,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification('Producto agregado al carrito');
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartUI();
        } else if (newQuantity === 0) {
            this.removeItem(productId);
        }
    }

    // Calculate subtotal
    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Calculate shipping
    getShipping() {
        const subtotal = this.getSubtotal();
        return subtotal >= 50000 ? 0 : 8000;
    }

    // Calculate total
    getTotal() {
        return this.getSubtotal() + this.getShipping();
    }

    // Get item count
    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Clear cart
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
    }

    // Update cart UI
    updateCartUI() {
        this.updateCartCount();
        this.updateCartModal();
    }

    // Update cart count badge
    updateCartCount() {
        const countElement = document.getElementById('cart-count');
        if (countElement) {
            const count = this.getItemCount();
            countElement.textContent = count;
            countElement.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    // Update cart modal content
    updateCartModal() {
        const container = document.getElementById('cart-items-container');
        const emptyMessage = document.getElementById('empty-cart-message');
        const subtotalElement = document.getElementById('cart-subtotal');
        const shippingElement = document.getElementById('cart-shipping');
        const totalElement = document.getElementById('cart-total');

        if (this.items.length === 0) {
            container.innerHTML = '';
            emptyMessage.classList.remove('d-none');
            subtotalElement.textContent = formatPrice(0);
            shippingElement.textContent = 'Gratis';
            totalElement.textContent = formatPrice(0);
        } else {
            emptyMessage.classList.add('d-none');
            container.innerHTML = this.items.map(item => this.createCartItemHTML(item)).join('');

            const subtotal = this.getSubtotal();
            const shipping = this.getShipping();
            const total = this.getTotal();

            subtotalElement.textContent = formatPrice(subtotal);
            shippingElement.textContent = shipping === 0 ? 'Gratis' : formatPrice(shipping);
            totalElement.textContent = formatPrice(total);
        }
    }

    // Create cart item HTML
    createCartItemHTML(item) {
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="bi bi-${item.icon}"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="bi bi-dash"></i>
                    </button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="bi bi-plus"></i>
                    </button>
                </div>
                <button class="remove-item-btn" onclick="cart.removeItem(${item.id})" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
    }

    // Show notification
    showNotification(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-check-circle-fill text-success me-2"></i>
                <span>${message}</span>
            </div>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Animate button that was clicked
        const buttons = document.querySelectorAll('.btn-add-to-cart');
        buttons.forEach(btn => {
            if (btn.matches(':hover')) {
                btn.classList.add('btn-success-animation');
                setTimeout(() => btn.classList.remove('btn-success-animation'), 300);
            }
        });

        // Remove notification after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize cart
const cart = new ShoppingCart();

// Add to cart function (called from product cards)
function addToCart(productId) {
    cart.addItem(productId);
}

// Checkout button handler
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.items.length === 0) {
                cart.showNotification('Tu carrito está vacío');
                return;
            }

            // Simulate checkout process
            const total = cart.getTotal();
            const itemCount = cart.getItemCount();
            
            // Show success message
            cart.showNotification(`¡Gracias por tu compra! Total: ${formatPrice(total)} (${itemCount} productos)`);
            
            // Clear cart after checkout
            setTimeout(() => {
                cart.clearCart();
            }, 1500);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
            if (modal) {
                modal.hide();
            }
        });
    }
});
