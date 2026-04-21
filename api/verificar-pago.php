<?php
// api/verificar-pago.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$pedidoId = $_GET['pedido'] ?? '';

if (!$pedidoId) {
    echo json_encode(['error' => 'No se especificó pedido']);
    exit;
}

$WOMPI_PRIVATE_KEY = 'prv_test_xxxxxxxxxxxxxxxxxxxxx';
$WOMPI_API_URL = 'https://api-sandbox.co.wompi.co/v1';

// Buscar transacción por referencia
$ch = curl_init($WOMPI_API_URL . '/transactions?reference=' . urlencode($pedidoId));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $WOMPI_PRIVATE_KEY
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if ($data && isset($data['data'][0])) {
    $transaction = $data['data'][0];
    echo json_encode([
        'status' => $transaction['status'],
        'transaction_id' => $transaction['id'],
        'amount' => $transaction['amount_in_cents'] / 100
    ]);
} else {
    echo json_encode(['status' => 'NOT_FOUND']);
}
?>