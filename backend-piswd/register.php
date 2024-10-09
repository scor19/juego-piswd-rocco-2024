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
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
    exit();
}

// Verificar si el correo electrónico ya existe
$query = "SELECT * FROM usuarios WHERE email = ?";
$stmt = mysqli_prepare($conexion, $query);
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) > 0) {
    echo json_encode(['success' => false, 'message' => 'El correo electrónico ya está registrado']);
    exit();
}

// Insertar el nuevo usuario
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$query = "INSERT INTO usuarios (email, password) VALUES (?, ?)";
$stmt = mysqli_prepare($conexion, $query);
mysqli_stmt_bind_param($stmt, "ss", $email, $hashed_password);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true, 'message' => 'Registro exitoso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al registrar el usuario']);
}
?>
