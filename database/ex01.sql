--Comment trong SQL
--update
-- UPDATE users SET updated_at=NULL WHERE id=1;
-- UPDATE users SET updated_at=NULL WHERE id=3;
--add data
-- INSERT INTO users(id, name, email, password, status, created_at, updated_at) 
-- VALUES (5, 'User 5', 'user5@gmail.com', '123456', false, NOW(), NOW());
-- SELECT * FROM users WHERE LOWER(email) LIKE '%user2%' OR LOWER(name) LIKE '%user 1%';
SELECT * FROM users WHERE updated_at IS NOT NULL;
