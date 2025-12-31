// Products Database
const products = [
    {
        id: 1,
        name: "Alimento Premium para Perros Adultos",
        category: "alimentos",
        price: 89900,
        oldPrice: 109900,
        description: "Alimento balanceado de alta calidad con proteínas naturales, vitaminas y minerales esenciales.",
        icon: "box-seam",
        badge: "Oferta"
    },
    {
        id: 2,
        name: "Concentrado para Gatos Premium",
        category: "alimentos",
        price: 75900,
        oldPrice: null,
        description: "Nutrición completa con sabor a salmón, ideal para gatos adultos de todas las razas.",
        icon: "box-seam",
        badge: null
    },
    {
        id: 3,
        name: "Snacks Naturales para Perros",
        category: "alimentos",
        price: 24900,
        oldPrice: 29900,
        description: "Premios saludables elaborados con ingredientes naturales, sin conservantes artificiales.",
        icon: "box-seam",
        badge: "Nuevo"
    },
    {
        id: 4,
        name: "Pelota Interactiva con Sonido",
        category: "juguetes",
        price: 32900,
        oldPrice: null,
        description: "Juguete resistente que emite sonidos divertidos, perfecto para horas de entretenimiento.",
        icon: "balloon-heart",
        badge: null
    },
    {
        id: 5,
        name: "Cuerda de Juego Resistente",
        category: "juguetes",
        price: 18900,
        oldPrice: null,
        description: "Ideal para juegos de tira y afloja, ayuda a limpiar los dientes mientras juega.",
        icon: "balloon-heart",
        badge: null
    },
    {
        id: 6,
        name: "Ratón de Juguete para Gatos",
        category: "juguetes",
        price: 12900,
        oldPrice: 15900,
        description: "Juguete con hierba gatera que estimula el instinto cazador de tu gato.",
        icon: "balloon-heart",
        badge: "Oferta"
    },
    {
        id: 7,
        name: "Collar Ajustable Premium",
        category: "accesorios",
        price: 35900,
        oldPrice: null,
        description: "Collar de nylon resistente con hebilla de seguridad y placa de identificación.",
        icon: "award",
        badge: null
    },
    {
        id: 8,
        name: "Correa Retráctil 5 Metros",
        category: "accesorios",
        price: 54900,
        oldPrice: 64900,
        description: "Correa extensible con sistema de freno, ideal para paseos cómodos y seguros.",
        icon: "award",
        badge: "Oferta"
    },
    {
        id: 9,
        name: "Cama Ortopédica para Mascotas",
        category: "accesorios",
        price: 129900,
        oldPrice: null,
        description: "Cama acolchada con espuma de memoria, perfecta para el descanso de tu mascota.",
        icon: "award",
        badge: "Premium"
    },
    {
        id: 10,
        name: "Transportadora Portátil",
        category: "accesorios",
        price: 89900,
        oldPrice: null,
        description: "Transportadora resistente y ventilada, ideal para viajes y visitas al veterinario.",
        icon: "award",
        badge: null
    },
    {
        id: 11,
        name: "Shampoo Antipulgas Natural",
        category: "higiene",
        price: 42900,
        oldPrice: null,
        description: "Shampoo con ingredientes naturales que elimina pulgas y garrapatas sin químicos agresivos.",
        icon: "moisture",
        badge: "Natural"
    },
    {
        id: 12,
        name: "Kit de Cepillado Profesional",
        category: "higiene",
        price: 38900,
        oldPrice: 45900,
        description: "Set completo de cepillos para el cuidado del pelaje de tu mascota.",
        icon: "moisture",
        badge: "Oferta"
    },
    {
        id: 13,
        name: "Toallitas Húmedas para Mascotas",
        category: "higiene",
        price: 19900,
        oldPrice: null,
        description: "Toallitas hipoalergénicas para limpieza rápida de patas y pelaje.",
        icon: "moisture",
        badge: null
    },
    {
        id: 14,
        name: "Cortaúñas Profesional",
        category: "higiene",
        price: 27900,
        oldPrice: null,
        description: "Cortaúñas ergonómico con protección de seguridad para un corte preciso y seguro.",
        icon: "moisture",
        badge: null
    },
    {
        id: 15,
        name: "Arena Sanitaria Premium",
        category: "higiene",
        price: 34900,
        oldPrice: 39900,
        description: "Arena aglomerante con control de olores, ideal para gatos.",
        icon: "moisture",
        badge: "Oferta"
    },
    {
        id: 16,
        name: "Comedero Automático Inteligente",
        category: "accesorios",
        price: 159900,
        oldPrice: null,
        description: "Dispensador programable de alimento con control desde tu smartphone.",
        icon: "award",
        badge: "Premium"
    },
    {
        id: 17,
        name: "Bebedero Fuente de Agua",
        category: "accesorios",
        price: 79900,
        oldPrice: 89900,
        description: "Fuente de agua con filtro, fomenta la hidratación constante de tu mascota.",
        icon: "award",
        badge: "Oferta"
    },
    {
        id: 18,
        name: "Rascador para Gatos",
        category: "juguetes",
        price: 119900,
        oldPrice: null,
        description: "Torre rascadora con múltiples niveles y juguetes integrados.",
        icon: "balloon-heart",
        badge: "Nuevo"
    }
];

// Format price as Colombian Pesos
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

// Create product card HTML
function createProductCard(product) {
    const oldPriceHTML = product.oldPrice 
        ? `<span class="product-price-old">${formatPrice(product.oldPrice)}</span>` 
        : '';
    
    const badgeHTML = product.badge 
        ? `<div class="product-badge">${product.badge}</div>` 
        : '';

    return `
        <div class="col-lg-3 col-md-4 col-sm-6 product-item" data-category="${product.category}">
            <div class="product-card">
                <div class="product-image">
                    <i class="bi bi-${product.icon} product-image-placeholder"></i>
                    ${badgeHTML}
                </div>
                <div class="product-body">
                    <div class="product-category">${getCategoryName(product.category)}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <div>
                            <div class="product-price">${formatPrice(product.price)}</div>
                            ${oldPriceHTML}
                        </div>
                        <button class="btn-add-to-cart" onclick="addToCart(${product.id})">
                            <i class="bi bi-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get category display name
function getCategoryName(category) {
    const categories = {
        'alimentos': 'Alimentos',
        'juguetes': 'Juguetes',
        'accesorios': 'Accesorios',
        'higiene': 'Higiene'
    };
    return categories[category] || category;
}

// Load products into the page
function loadProducts(filter = 'all') {
    const container = document.getElementById('products-container');
    let filteredProducts = products;

    if (filter !== 'all') {
        filteredProducts = products.filter(p => p.category === filter);
    }

    container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

// Get product by ID
function getProductById(id) {
    return products.find(p => p.id === id);
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();

    // Add filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter products
            const category = this.getAttribute('data-category');
            loadProducts(category);
        });
    });
});
