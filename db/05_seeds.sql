-- Insert some test data

INSERT INTO `2dof_disks` (disk_code, path) VALUES ('MK57', '{"path": [
    76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76,
    76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76,
    83, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90,
    90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90,
    90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90,
    90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90,
    90, 90, 83, 76, 76, 76, 76, 76, 76, 76, 76, 76,
    76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76,
    76, 76, 76, 76
  ]}');

INSERT INTO `2dof_sessions` (session_id, created_by) VALUES ('AB123', (SELECT ID FROM `wpf_users` LIMIT 1));

INSERT INTO `2dof_runs` (user, session_ref, disk_ref, eval) VALUES (
    (SELECT ID FROM `wpf_users` LIMIT 1),
    (SELECT ID FROM `2dof_sessions` LIMIT 1),
    (SELECT ID FROM `2dof_disks` LIMIT 1),
    85.78
);