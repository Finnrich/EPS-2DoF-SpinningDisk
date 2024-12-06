<?php

/*

Endpoint for sessions
Client has to be logged in to access this endpoint
(WordPress user needs to have the '2dof_access_api' capability)
This endpoint is meant for teachers to manage their session
(Teacher role should have the '2dof_create_sessions' capability in WordPress)

    GET    - Returns all sessions created by the client-user
    No parameters

    POST   - Create a new session, returns new session ID
    No parameters

    DELETE - Delete a session by session ID or all older than 30 days
    Parameters (URL):
        - byage   FLAG   (if set, all sessions older than 30 days will be deleted)
        - sid     STR    (Session ID to delete)

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

    // Create a new session
    case 'POST':
        // Cancel if user cannot create sessions
        if ($cur_user->has_cap('2dof_create_sessions') !== true) {
            http_response_code(403);
            exit;
        }
        // Create session
        $sql = "SELECT new_session(%d) AS session_id";
        $query = $wpdb->prepare($sql, $cur_user->get('ID'));
        $result = $wpdb->get_results($query, $output=ARRAY_A);
        echo(json_encode($result[0]));
        exit;

    // Get sessions created by user (only teachers)
    case 'GET':
        $sql = "SELECT session_id FROM `2dof_sessions` WHERE created_by=%d";
        $query = $wpdb->prepare($sql, $cur_user->get('ID'));
        $result = $wpdb->get_results($query, $output=ARRAY_A);
        echo(json_encode($result));
        exit;

    // Delete a session (only by creator)
    case 'DELETE':

        $sql = "DELETE FROM `2dof_sessions` WHERE created_by=%d";
        $sql = $wpdb->prepare($sql, $cur_user->get('ID'));

        if (isset($_GET['byage'])) { // delete by age (30 days)

            $query = $sql . " AND DATE_ADD(ts_created, INTERVAL 30 DAY) < CURRENT_TIMESTAMP";

        } else { // delete by session ID

            if (!isset($_GET['sid'])) {
                http_response_code(400);
                exit;
            }

            $sql .= " AND session_id=%s";
            $query = $wpdb->prepare($sql, $_GET['sid']);
        }

        $result = $wpdb->query($query);
        if ($result === 0) {
            http_response_code(404);
        }
        exit;
}