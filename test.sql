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
