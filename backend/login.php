<?php

include 'load_wp.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!(isset($_POST['username']) && isset($_POST['password']))) {
        http_response_code(400);
        exit;
    }

    $result = wp_signon(
        array(
            "user_login" => $_POST['username'],
            "user_password" => $_POST['password'],
            "remember" => true
        )
    );

    if (is_a($result, 'WP_User')) {
        echo(1);
    } else {
        http_response_code(401);
        exit;
    }

} else {
    http_response_code(400);
    exit;
}