// js/wompi-config.js
const WOMPI_CONFIG = {
    // Cambia esto según tu entorno
    publicKey: 'pub_test_xxxxxxxxxxxxxxxxxxxxx', // Tu Public Key de pruebas
    isTest: true, // Cambiar a false en producción
    
    // URLs de tu sitio
    urls: {
        confirmation: 'https://tusitio.com/api/wompi-confirm',
        redirect: 'https://tusitio.com/gracias.html'
    }
};

// Inicializar Wompi cuando el DOM esté listo
function inicializarWompi() {
    if (typeof Wompi !== 'undefined') {
        Wompi.initialize({
            publicKey: WOMPI_CONFIG.publicKey,
            isTest: WOMPI_CONFIG.isTest
        });
    } else {
        console.warn('Wompi no está cargado');
    }
}