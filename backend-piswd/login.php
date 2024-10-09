<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Configuración de la base de datos
$host = 'localhost';
$dbname = 'piswd';
$username = 'root';
$password = '';

// Conexión a la base de datos
$conexion = mysqli_connect($host, $username, $password, $dbname);
if (!$conexion) {
    die("Conexión fallida: " . mysqli_connect_error());
}

// Obtener los datos enviados desde el front-end
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];
$password = $data['password'];

// Validar que no estén vacíos
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email o contraseña no proporcionados']);
    exit();
}

// Verificar si el usuario existe en la base de datos
$query = "SELECT * FROM usuarios WHERE email = ?";
$stmt = mysqli_prepare($conexion, $query);
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);

if ($user) {
    // Verificar la contraseña con password_verify()
    if (password_verify($password, $user['password'])) {
        echo json_encode(['success' => true, 'message' => 'Login exitoso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'El usuario no existe']);
}

mysqli_close($conexion);
?>
