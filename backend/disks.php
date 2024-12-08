<?php

/*

Endpoint for disks

    GET    - Returns path of disk
    Parameters (URL):
        - did     STR    (Disk Code)

*/

include 'load_wp.php';

header('Content-type: application/json');

global $wpdb;

switch($_SERVER['REQUEST_METHOD']) {

    // Get disk
    case 'GET':
        $return = new stdClass();

        if (!isset($_GET['did'])) {
            http_response_code(400);
            exit;
        }

        $sql = "SELECT path FROM `2dof_disks` WHERE disk_code = %s";

        $query = $wpdb->prepare($sql, $_GET['did']);

        $result = $wpdb->get_results($query, $output=ARRAY_A);

        if (count($result) === 0) {
            http_response_code(404);
            exit;
        }

        $return = $result[0]['path'];

        echo($return);
        exit;
}