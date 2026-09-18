<?php 

include("inicio.php");
if ($conex) {
    //echo "todo correcto";
    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        $sueldo = $_POST["sueldo"];
        $email = $_POST["email"];
        $nombre = $_POST["nombre"];
        $password = $_POST["password"];

        echo "Conexión correcta<br>";
        echo "Hola " . htmlspecialchars($nombre);
        $sql = "INSERT INTO inicio (sueldo, email, nombre, contraseña)
                VALUES (?, ?, ?, ?)";

        $stmt = mysqli_prepare($conex, $sql);

        mysqli_stmt_bind_param(
            $stmt,
            "dsss",
            $sueldo,
            $email,
            $nombre,
            $password
        );

        if (mysqli_stmt_execute($stmt)) {
            header("Location: tarea2.html");
            exit;
        } else {
            echo "Error: " . mysqli_stmt_error($stmt);
        }
    }
    
    
}
exit;

?>