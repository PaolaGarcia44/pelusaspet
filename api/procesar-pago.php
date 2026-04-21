<?php
// api/procesar-pago.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de Wompi
$WOMPI_PRIVATE_KEY = 'prv_test_xxxxxxxxxxxxxxxxxxxxx'; // Tu Private Key
$WOMPI_API_URL = 'https://api-sandbox.co.wompi.co/v1'; // Sandbox (pruebas)

// Recibir datos del frontend
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['error' => 'No se recibieron datos']);
    exit;
}

// Validar datos mínimos
if (!isset($data['amount']) || !isset($data['currency']) || !isset($data['payment_method'])) {
    echo json_encode(['error' => 'Faltan datos requeridos']);
    exit;
}

// Crear la transacción en Wompi
$transactionData = [
    'amount_in_cents' => $data['amount'] * 100, // Wompi trabaja en centavos
    'currency' => $data['currency'],
    'customer_email' => $data['email'],
    'payment_method' => [
        'type' => $data['payment_method'],
        'installments' => $data['installments'] ?? 1,
        'token' => $data['token'] ?? null
    ],
    'reference' => 'PED-' . time() . '-' . rand(100, 999),
    'redirect_url' => $data['redirect_url'] ?? 'https://tusitio.com/gracias.html'
];

// Llamar a la API de Wompi
$ch = curl_init($WOMPI_API_URL . '/transactions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $WOMPI_PRIVATE_KEY,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($transactionData));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 201) {
    $result = json_decode($response, true);
    echo json_encode([
        'success' => true,
        'transaction_id' => $result['data']['id'],
        'payment_url' => $result['data']['payment_link'] ?? null,
        'status' => $result['data']['status']
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Error al procesar el pago',
        'details' => json_decode($response, true)
    ]);
}
?>