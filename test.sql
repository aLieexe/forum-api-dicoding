SELECT
  c.id,
  u.username,
  date,
  CASE WHEN is_deleted THEN
    '**komentar telah dihapus**'
  ELSE
    c.content
  END AS content
FROM
  comments c
  JOIN users u ON c.owner = u.id
WHERE
  c.thread_id = $1;

SELECT
  t.id,
  title,
  body,
  date,
  u.username
FROM
  threads t
  JOIN users u ON t.owner = u.id
WHERE
  id = $1;

SELECT
  r.id,
  u.username,
  r.date,
  r.comment_id,
  CASE WHEN is_deleted THEN
    '**balasan telah dihapus**'
  ELSE
    r.content
  END AS content
FROM
  reply r
  JOIN users u ON r.owner = u.id
WHERE
  r.comment_id = $1
ORDER BY
  r.date ASC;

SELECT
  r.id,
  u.username,
  r.date,
  r.comment_id,
  CASE WHEN is_deleted THEN
    '**balasan telah dihapus**'
  ELSE
    r.content
  END AS content
FROM
  reply r
  JOIN users u ON r.owner = u.id
WHERE
  comment_id = ANY ($1)
