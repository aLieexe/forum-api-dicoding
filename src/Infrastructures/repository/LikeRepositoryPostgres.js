const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async toggleLike(likeData) {
    const { commentId, userId } = likeData;
    const query = {
      text:
        `
        INSERT INTO likes(user_id, comment_id)
          VALUES ($1, $2)
        ON CONFLICT (user_id, comment_id)
          DO UPDATE SET
            is_liked = NOT likes.is_liked;
        `,
      values: [userId, commentId],
    };
    await this._pool.query(query);
  }

  async getLikesCount(comments) {
    const commentsId = [];

    comments.forEach((comment) => {
      commentsId.push(comment.id);
    });

    const query = {
      text: `
      SELECT
        comment_id,
        COUNT(comment_id)
      FROM
        likes
      WHERE
        comment_id = ANY($1) AND is_liked = TRUE
      GROUP BY
        comment_id;
      `,
      values: [commentsId],
    };

    const count = await this._pool.query(query);
    return count.rows;
  }
}

module.exports = LikeRepositoryPostgres;
