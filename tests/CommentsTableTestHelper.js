/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const AddedComment = require('../src/Domains/comments/entities/AddedComment');

const CommentsTableTestHelper = {
  async cleanTable() {
    await pool.query('DELETE FROM comments');
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async addComment({
    content = 'a content body', ownerId = 'user-123', threadId = 'thread-123',
  }, deleted = false) {
    const id = 'comment-123';
    const query = {
      text: 'INSERT INTO comments (id, owner, content, thread_id, is_deleted) VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, ownerId, content, threadId, deleted],
    };

    const data = await pool.query(query);
    const addedThreads = new AddedComment(data.rows[0]);

    return addedThreads;
  },

};

module.exports = CommentsTableTestHelper;
