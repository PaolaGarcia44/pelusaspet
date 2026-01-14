<?php
// api/guardar-pedido.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Agregar fecha y ID
    $data['fecha'] = date('Y-m-d H:i:s');
    $data['id'] = 'PED_' . time() . '_' . rand(1000, 9999);
    $data['estado'] = 'pendiente';
    
    // Guardar en archivo JSON
    $archivo = 'pedidos.json';
    
    // Leer pedidos existentes
    $pedidos = [];
    if (file_exists($archivo)) {
        $contenido = file_get_contents($archivo);
        $pedidos = json_decode($contenido, true) ?: [];
    }
    
    // Agregar nuevo pedido
    $pedidos[] = $data;
    
    // Guardar
    if (file_put_contents($archivo, json_encode($pedidos, JSON_PRETTY_PRINT))) {
        echo json_encode([
            'success' => true,
            'pedido_id' => $data['id'],
            'message' => 'Pedido guardado correctamente'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al guardar el pedido'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?>