// Navegación entre secciones (redirección a páginas separadas)
document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.tab');
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('menu');
  
  // Navegación entre secciones - redirección a páginas separadas
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const target = this.getAttribute('data-tab');
      
      // Definir los nombres de archivo para cada sección
      const pageMap = {
        'productos': 'productos.html',
        'nosotros': 'nosotros.html',
        'casos': 'casos.html',
        'reconocimientos': 'reconocimientos.html',
        'contacto': 'contacto.html'
      };
      
      // Redireccionar a la página correspondiente
      if (pageMap[target]) {
        window.location.href = pageMap[target];
      } else {
        window.location.href = 'index.html'; // Página principal por defecto
      }
    });
  });
  
  // Menú hamburguesa (solo para móviles en la página principal)
  hamburger.addEventListener('click', function() {
    menu.classList.toggle('show');
  });
  
  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', function(event) {
    if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
      menu.classList.remove('show');
    }
  });
  
  // Agregar funcionalidad básica al carrito
  const cartIcon = document.querySelector('.fa-shopping-cart');
  if (cartIcon) {
    cartIcon.addEventListener('click', function() {
      alert('Carrito de compras - Próximamente disponible');
    });
  }
  
  // Funcionalidad básica para botones "Añadir al Carrito"
  const addToCartButtons = document.querySelectorAll('.card button');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productName = this.parentElement.querySelector('h3').textContent;
      alert(`"${productName}" ha sido agregado al carrito`);
    });
  });
});