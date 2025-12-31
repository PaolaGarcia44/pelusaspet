# PelusasPet - E-commerce para Mascotas

Una página web moderna y responsiva para la venta de productos y servicios para mascotas, desarrollada con HTML5, CSS3, JavaScript y Bootstrap 5.

## 🚀 Características

- **Página de Inicio Atractiva**: Portada con diseño moderno y profesional
- **Marketplace de Productos**: Catálogo con 18+ productos organizados por categorías
- **Carrito de Compras Funcional**: Sistema completo de carrito con persistencia en localStorage
- **Diseño Responsivo**: Optimizado para dispositivos móviles, tablets y desktop
- **Filtros por Categoría**: Filtra productos por Alimentos, Juguetes, Accesorios e Higiene
- **Gestión de Cantidades**: Incrementa/decrementa cantidades desde el carrito
- **Cálculo Automático**: Subtotales, envío y total calculados dinámicamente
- **Interfaz Intuitiva**: Navegación suave y animaciones fluidas

## 📁 Estructura del Proyecto

```
pelusaspet/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos personalizados
├── js/
│   ├── products.js     # Base de datos de productos
│   ├── cart.js         # Funcionalidad del carrito
│   └── main.js         # JavaScript principal
├── images/             # Directorio para imágenes (placeholder)
├── .gitignore          # Archivos ignorados por Git
└── README.md           # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y moderna
- **CSS3**: Estilos personalizados con variables CSS y animaciones
- **JavaScript ES6+**: Funcionalidad interactiva y gestión de estado
- **Bootstrap 5.3**: Framework CSS para diseño responsivo
- **Bootstrap Icons**: Iconografía profesional
- **LocalStorage API**: Persistencia del carrito de compras

## 🎨 Categorías de Productos

1. **Alimentos**: Concentrados, snacks y nutrición para mascotas
2. **Juguetes**: Pelotas, cuerdas y juguetes interactivos
3. **Accesorios**: Collares, correas, camas y transportadoras
4. **Higiene**: Shampoos, cepillos, cortaúñas y arena sanitaria

## 💻 Cómo Usar

1. **Visualización Local**:
   - Abre el archivo `index.html` directamente en tu navegador
   - No requiere servidor web para funcionar

2. **Con un Servidor Local** (Recomendado):
   ```bash
   # Usando Python 3
   python -m http.server 8000
   
   # Usando PHP
   php -S localhost:8000
   
   # Usando Node.js con http-server
   npx http-server
   ```
   Luego abre `http://localhost:8000` en tu navegador

## 🛒 Funcionalidades del Carrito

- **Agregar Productos**: Click en el botón del carrito en cada producto
- **Ver Carrito**: Click en el icono del carrito en la navegación
- **Modificar Cantidades**: Usa los botones + y - en el modal del carrito
- **Eliminar Productos**: Click en el icono de basura
- **Envío Gratis**: Compras superiores a $50.000 COP
- **Persistencia**: El carrito se mantiene aunque cierres el navegador

## 📱 Diseño Responsivo

El sitio está optimizado para:
- 📱 Móviles (< 768px)
- 📱 Tablets (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🎯 Características Destacadas

- **Animaciones Suaves**: Transiciones y animaciones CSS
- **Notificaciones**: Toast notifications al agregar productos
- **Filtros Dinámicos**: Cambio de categorías sin recargar
- **Badge de Contador**: Número de items en el carrito siempre visible
- **Back to Top**: Botón para volver arriba
- **Scroll Spy**: Navegación activa según sección visible

## 🔮 Futuras Mejoras

- [ ] Integración con pasarela de pago real
- [ ] Sistema de usuarios y autenticación
- [ ] Panel de administración para gestionar productos
- [ ] Sistema de búsqueda avanzada
- [ ] Wishlist / Lista de deseos
- [ ] Reviews y calificaciones de productos
- [ ] Integración con redes sociales
- [ ] Chat de soporte en vivo
- [ ] Sistema de cupones y descuentos

## 👥 Autor

PelusasPet Team - 2024

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
