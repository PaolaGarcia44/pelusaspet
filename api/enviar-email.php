<?php
// api/enviar-email.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Configuración
    $destinatario = "ventas@pelusaspet.com"; // Cambia esto
    $asunto = "Nuevo contacto desde PelusasPet";
    
    // Construir mensaje
    $mensaje = "Nuevo mensaje de contacto:\n\n";
    $mensaje .= "Nombre: " . htmlspecialchars($data['nombre']) . "\n";
    $mensaje .= "Email: " . htmlspecialchars($data['email']) . "\n";
    $mensaje .= "Teléfono: " . htmlspecialchars($data['telefono']) . "\n";
    $mensaje .= "Mensaje: " . htmlspecialchars($data['mensaje']) . "\n\n";
    $mensaje .= "Enviado el: " . date('d/m/Y H:i:s');
    
    // Cabeceras
    $headers = "From: PelusasPet <no-reply@pelusaspet.com>\r\n";
    $headers .= "Reply-To: " . htmlspecialchars($data['email']) . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Enviar email
    if (mail($destinatario, $asunto, $mensaje, $headers)) {
        echo json_encode([
            'success' => true,
            'message' => 'Mensaje enviado correctamente'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al enviar el mensaje'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?>