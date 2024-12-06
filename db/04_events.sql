DROP EVENT IF EXISTS `clean_sessions`;

-- Delete sessions older than 30 days (executed every day at 00:00)

-- Not implemented in this version because we don't have the permission to create events
-- Instead we delete an old session if a collision accurs

CREATE EVENT clean_sessions
ON SCHEDULE AT TIMESTAMP'2024-04-12 00-00-00' + INTERVAL 1 DAY
DO
    SELECT delete_old_sessions(30);