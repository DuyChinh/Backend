-- GROUP BY
-- HAVING
-- Khi kết hợp với các hàm COUNT(), SUM(), MAX(), MIN()
--- Hiển thị danh sách users và số lượng bài posts của từng user
--- Trả về danh sách các users có bài viết  >= 2
--- Hiển thị thông tin users có số bài viết lớn nhất
-- SELECT COUNT(id), status FROM users GROUP BY status;

---C1
SELECT COUNT(posts.id) as posts_count, users.* 
FROM users
LEFT JOIN posts
ON users.id = posts.user_id
GROUP BY users.id 
HAVING COUNT(posts.id) = (
	SELECT MAX(post_count)
	FROM (
		SELECT COUNT(id) as post_count
		FROM posts
		GROUP BY user_id
	) 
);
-- ORDER BY posts_count DESC
-- LIMIT 1;

--C2


-- SELECT users.*, (SELECT count(id) FROM posts WHERE posts.user_id = users_id) AS post_count FROM users



