<?php

/*

Endpoint for runs
Client has to be logged in to access this endpoint
(WordPress user needs to have the '2dof_access_api' capability)

    GET    - Returns runs sorted by session id and optionally disk code
    Parameters (URL):
        - sid     STR    (Session ID)
        - did     STR    (Disk Code)

    POST   - Upload a run
    Parameters (Form):
        - sid     STR    (Session ID)
        - did     STR    (Disk Code)
        - eval    FLOAT  (Evaluation percentage)

*/

include 'load_wp.php';

header('Content-type: application/json');

// Cancel if user is not logged in
if (is_user_logged_in() !== true) {
    http_response_code(403);
    exit;
}

$cur_user = wp_get_current_user();

// Cancel if user cannot access 2dof-API
if ($cur_user->has_cap('2dof_access_api') !== true) {
    http_response_code(403);
    exit;
}

global $wpdb;

switch($_SERVER['REQUEST_METHOD']) {

    // Upload a run
    case 'POST':
        if (!(isset($_POST['sid']) && isset($_POST['did']) && isset($_POST['eval']))) {
            http_response_code(400);
            exit;
        }
        $sql = "REPLACE INTO `2dof_runs` (user, session_ref, disk_ref, eval) VALUES (
                    %d,
                    (SELECT id FROM `2dof_sessions` WHERE session_id = %s),
                    (SELECT id FROM `2dof_disks` WHERE disk_code = %s),
                    %f
                )"
        ;
        $query = $wpdb->prepare($sql, $cur_user->get('ID'), $_POST['sid'], $_POST['did'], $_POST['eval']);
        $result = $wpdb->query($query);
        if ($result === false) {
            if (str_starts_with($wpdb->last_error, 'Duplicate')) { // Only doing something if INSERT
                http_response_code(409);
            } else {
                http_response_code(404);
            }
            exit;
        }
        echo('{}');
        exit;

    // Get runs
    case 'GET':
        $return = new stdClass();

        if (!isset($_GET['sid'])) {
            http_response_code(400);
            exit;
        }

        // filter by session id

        $page = 0;
        $items_per_page = 25;

        if (isset($_GET['page'])) {
            $page = intval($_GET['page']);
        }

        $sql = "SELECT u.user_nicename AS username, s.session_id, d.disk_code, r.eval, r.ts_created
                FROM `2dof_runs` AS r LEFT JOIN `wpf_users` AS u ON r.user = u.ID
                LEFT JOIN `2dof_sessions` AS s ON r.session_ref = s.id
                LEFT JOIN `2dof_disks` AS d ON r.disk_ref = d.id
                WHERE s.session_id = %s"
        ;

        $sql = $wpdb->prepare($sql, $_GET['sid']);

        if (isset($_GET['did'])) { // also filter by disk code
            $sql .= " AND d.disk_code = %s";
            $sql = $wpdb->prepare($sql, $_GET['did']);
        }

        $sql .= " ORDER BY r.eval DESC LIMIT ". $items_per_page ." OFFSET %d";

        $query = $wpdb->prepare($sql, $page*$items_per_page);
        $result = $wpdb->get_results($query, $output=ARRAY_A);

        if (count($result) === 0) {
            http_response_code(404);
            exit;
        }

        $return = $result;

        echo(json_encode($return));
        exit;
}