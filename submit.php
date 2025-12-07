<?php
// Set the content type to JSON for the AJAX response
header('Content-Type: application/json');

// Database credentials - ***CHANGE THESE TO YOUR LOCAL SETTINGS***
$host = 'localhost'; 
$db   = 'contact_db'; 
$user = 'root'; // Default XAMPP/MAMP user
$pass = ''; // Default XAMPP/MAMP password

// Response array to send back to JavaScript
$response = ['success' => false, 'message' => ''];

try {
    // 1. Establish the PDO Database Connection
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if the request method is POST and form data is present
    if ($_SERVER["REQUEST_METHOD"] === "POST" && 
        isset($_POST['name'], $_POST['email'], $_POST['subject'], $_POST['message'])) {

        // 2. Collect and Sanitize Data
        $name = trim($_POST['name']);
        $email = trim($_POST['email']);
        $subject = trim($_POST['subject']);
        $message = trim($_POST['message']);

        // Optional: Simple server-side validation (always validate on the server!)
        if (empty($name) || empty($email) || empty($message)) {
            $response['message'] = 'All fields are required.';
            echo json_encode($response);
            exit;
        }

        // 3. Prepare and Execute the INSERT Query (using prepared statements)
        $sql = "INSERT INTO messages (name, email, subject, message) VALUES (:name, :email, :subject, :message)";
        
        $stmt = $pdo->prepare($sql);
        
        // Bind parameters to protect against SQL Injection
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':subject', $subject);
        $stmt->bindParam(':message', $message);
        
        $stmt->execute();

        // 4. Success Response
        $response['success'] = true;
        $response['message'] = 'Thank you! Your message has been sent and saved.';

    } else {
        $response['message'] = 'Invalid request method or missing form data.';
    }

} catch (PDOException $e) {
    // 5. Error Response
    // In a real application, you would log the error and give a generic message.
    error_log("Database error: " . $e->getMessage());
    $response['message'] = 'A server error occurred. Please try again later.';
}

// Send the JSON response back to the client-side JavaScript
echo json_encode($response);
?>