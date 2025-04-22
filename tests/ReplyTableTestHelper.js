/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const AddedReply = require('../src/Domains/replies/entities/AddedReply');

const ReplyTestTableHelper = {
  async cleanTable() {
    await pool.query('DELETE FROM reply');
  },

  async addReply(
    { content = 'a reply content', ownerId = 'user-123', commentId = 'comment-123' },
    deleted = false,
  ) {
    const id = 'reply-123';
    const query = {
      text: 'INSERT INTO reply (id, owner, content, comment_id, is_deleted) VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, ownerId, content, commentId, deleted],
    };

    const data = await pool.query(query);
    const addedReply = new AddedReply(data.rows[0]);

    return addedReply;
  },

  async findReplyById(replyId) {
    const query = {
      text: 'SELECT id from reply where id = $1',
      values: [replyId],
    };

    const data = await pool.query(query);
    return data.rows;
  },
};

module.exports = ReplyTestTableHelper;
