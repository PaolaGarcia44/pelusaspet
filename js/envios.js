// envios.js - Sistema de cálculo de envíos
class CalculadoraEnvios {
    constructor() {
        this.tarifas = {
            'bogota': { nombre: 'Bogotá D.C.', precio: 8000, dias: 1 },
            'medellin': { nombre: 'Medellín', precio: 7000, dias: 1 },
            'cali': { nombre: 'Cali', precio: 9000, dias: 2 },
            'barranquilla': { nombre: 'Barranquilla', precio: 12000, dias: 3 },
            'cartagena': { nombre: 'Cartagena', precio: 13000, dias: 3 },
            'bucaramanga': { nombre: 'Bucaramanga', precio: 11000, dias: 2 },
            'pereira': { nombre: 'Pereira', precio: 10000, dias: 2 },
            'manizales': { nombre: 'Manizales', precio: 9500, dias: 2 },
            'otras': { nombre: 'Otras ciudades', precio: 15000, dias: 3 }
        };
        
        console.log('CalculadoraEnvios inicializada');
    }
    
    // Obtener tarifas
    getTarifas() {
        return this.tarifas;
    }
    
    // Calcular envío para una ciudad
    calcular(ciudadId) {
        return this.tarifas[ciudadId] || this.tarifas['otras'];
    }
    
    // Inicializar select de ciudades
    inicializarSelect(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        select.innerHTML = '<option value="">Selecciona tu ciudad</option>';
        
        Object.entries(this.tarifas).forEach(([id, ciudad]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = `${ciudad.nombre} - $${ciudad.precio.toLocaleString()} (${ciudad.dias} día${ciudad.dias > 1 ? 's' : ''})`;
            select.appendChild(option);
        });
    }
}

// Inicializar si se necesita
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('ciudad-envio')) {
        const calculadora = new CalculadoraEnvios();
        calculadora.inicializarSelect('ciudad-envio');
        console.log('Select de envíos inicializado');
    }
});

// ========== FUNCIÓN ACTUALIZADA CON CÓDIGO POSTAL ==========
function enviarPedidoEmail(pedido) {
    // Asegurar que codigo_postal existe, si no, poner "No especificado"
    const codigoPostal = pedido.codigo_postal && pedido.codigo_postal.trim() !== "" 
        ? pedido.codigo_postal 
        : "No especificado";

    emailjs.send(
        "service_xy3w3rx",
        "template_4yvqmur",
        {
            pedido_id: pedido.id,
            fecha: new Date().toLocaleDateString(),
            estado: "En preparación",
            total: pedido.total,

            nombre_cliente: pedido.nombre,
            telefono: pedido.telefono,
            email_cliente: pedido.email,

            direccion: pedido.direccion,
            informacion_adicional: pedido.notasa,
            ciudad: pedido.ciudad,
            departamento: pedido.departamento,
            codigo_postal: codigoPostal,  // ← NUEVO CAMPO AGREGADO

            productos: pedido.productos
        }
    )
    .then(res => console.log("✅ Email enviado", res))
    .catch(err => console.log("❌ Error email", err));
}