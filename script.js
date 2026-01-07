// script.js - Versión mejorada con botones flotantes
document.addEventListener('DOMContentLoaded', function() {
  // Elementos del menú móvil
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenuBtn = document.getElementById('closeMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  
  // Funcionalidad del carrito
  const cartIcon = document.querySelector('.fa-shopping-cart');
  if (cartIcon) {
    cartIcon.addEventListener('click', function(e) {
      e.preventDefault();
      alert('🛒 Carrito de compras - Próximamente disponible');
    });
  }
  
  // Botones "Añadir al Carrito"
  const addToCartButtons = document.querySelectorAll('.card button');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productName = this.parentElement.querySelector('h3').textContent;
      const productPrice = this.parentElement.querySelector('.price')?.textContent || '';
      alert(`✅ "${productName}" ${productPrice ? '(' + productPrice + ')' : ''} ha sido agregado al carrito`);
    });
  });
  
  // MENÚ HAMBURGUESA MEJORADO
  if (hamburger && mobileMenu) {
    // Abrir menú móvil
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Cerrar menú móvil
    if (closeMenuBtn) {
      closeMenuBtn.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    
    // Cerrar menú al hacer clic en un enlace
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
      if (mobileMenu.classList.contains('active') && 
          !mobileMenu.contains(e.target) && 
          !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Cerrar menú con tecla ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Resaltar página actual en el menú
  function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('nav a, .mobile-nav a');
    
    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      // Remover clase active de todos
      link.classList.remove('active');
      
      // Agregar clase active al enlace correspondiente
      if (href === currentPage || 
          (currentPage === 'index.html' && (href === 'index.html' || href === '' || href === '#')) ||
          (!currentPage && (href === 'index.html' || href === '' || href === '#'))) {
        link.classList.add('active');
      }
    });
  }
  
  // Ejecutar al cargar la página
  highlightCurrentPage();
  
  // Manejo del formulario de contacto (si existe)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name')?.value || '';
      const subject = document.getElementById('subject')?.value || 'consulta';
      
      alert(`✅ ¡Gracias ${name || 'cliente'}! Tu mensaje ha sido enviado.\nTe contactaremos en menos de 24 horas.`);
      
      // Limpiar el formulario
      contactForm.reset();
    });
  }
  
  // Smooth scroll para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Efecto hover mejorado para tarjetas
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
    });
  });
  
  // Efectos especiales para botones flotantes
  const floatingButtons = document.querySelectorAll('.floating-btn');
  floatingButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.1)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Click animation
    button.addEventListener('click', function() {
      this.style.transform = 'scale(0.9)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
    });
  });
});

// script.js - Verifica que tengas este código
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('closeMenu');
  
  // Abrir menú
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  // Cerrar menú
  closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
  });
  
  // Cerrar menú al hacer clic en enlace
  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });
});


