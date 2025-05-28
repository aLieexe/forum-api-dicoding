/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeTestTableHelper = {
  async cleanTable() {
    await pool.query('DELETE FROM likes');
  },

  async addLikes(
    { userId = 'user-123', commentId = 'comment-123' },
    isLiked = true,
  ) {
    const query = {
      text: 'INSERT INTO likes (user_id, comment_id, is_liked) VALUES ($1, $2, $3)',
      values: [userId, commentId, isLiked],
    };

    await pool.query(query);
  },

};

module.exports = LikeTestTableHelper;
