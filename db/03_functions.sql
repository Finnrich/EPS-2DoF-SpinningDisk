DROP FUNCTION IF EXISTS `new_session`;
DROP PROCEDURE IF EXISTS `delete_old_sessions`;

-- => ! IMPORTANT ! <= --
-- This function relies on the fact that a collision of session ids is very unlikely while it is still in use
-- Sessions are only meant to be used during one class

DELIMITER $$
CREATE FUNCTION new_session(user_id BIGINT) RETURNS VARCHAR(5)

BEGIN
    DECLARE chars VARCHAR(36) DEFAULT '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    DECLARE s_id VARCHAR(5);

    -- Generate 5 character session id
    SELECT CONCAT(
        SUBSTRING(chars, FLOOR(1 + RAND() * 36), 1),
        SUBSTRING(chars, FLOOR(1 + RAND() * 36), 1),
        SUBSTRING(chars, FLOOR(1 + RAND() * 36), 1),
        SUBSTRING(chars, FLOOR(1 + RAND() * 36), 1),
        SUBSTRING(chars, FLOOR(1 + RAND() * 36), 1)
    ) INTO s_id;

    -- This should be INSERT instead of REPLACE if the event `clean_sessions` is used
    -- If a collision happens with REPLACE, the older session + runs get deleted
    REPLACE INTO `2dof_sessions` (session_id, created_by) VALUES (s_id, user_id);

    RETURN s_id;
END $$

-- Delete old sessions
-- Used by event `clean_sessions` or for manual use
DELIMITER $$
CREATE PROCEDURE delete_old_sessions(age_in_days INT)

BEGIN
    DELETE FROM `2dof_sessions` WHERE DATE_ADD(ts_created, INTERVAL age_in_days DAY) < CURRENT_TIMESTAMP;
END $$