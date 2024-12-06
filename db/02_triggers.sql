DROP TRIGGER IF EXISTS `2dof_check_run`;
DROP TRIGGER IF EXISTS `2dof_check_session`;
DROP TRIGGER IF EXISTS `2dof_check_disk`;

DELIMITER $$
CREATE TRIGGER `2dof_check_run`
BEFORE INSERT ON `2dof_runs`
FOR EACH ROW 
BEGIN
    -- Check evaluation value
    IF NOT (NEW.eval BETWEEN 0 AND 100) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Evaluation can only be between 0 and 100';
    END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `2dof_check_session`
BEFORE INSERT ON `2dof_sessions`
FOR EACH ROW 
BEGIN
    -- Session ID to uppercase
    SET NEW.session_id = UPPER(NEW.session_id);

    -- Check session-id
    IF NOT (NEW.session_id REGEXP '^[a-zA-Z0-9]{5}$') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Session-ID must be 5 characters containing only letters and numbers';
    END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `2dof_check_disk`
BEFORE INSERT ON `2dof_disks`
FOR EACH ROW 
BEGIN
    -- Disk Code to uppercase
    SET NEW.disk_code = UPPER(NEW.disk_code);

    -- Check disk code
    IF NOT (NEW.disk_code REGEXP '^[a-zA-Z0-9]{4}$') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Disk-Code must be 4 characters containing only letters and numbers';
    END IF;
END $$
DELIMITER ;