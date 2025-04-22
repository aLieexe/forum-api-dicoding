const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  // @ts-ignore
  async addReply(replyToAdd) {
    const id = `reply-${this._idGenerator()}`;
    const { content, owner, comment } = replyToAdd;

    const query = {
      text: 'INSERT INTO reply (id, owner, content, comment_id) VALUES ($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, owner, content, comment],
    };

    try {
      const data = await this._pool.query(query);

      const addedReply = new AddedReply(data.rows[0]);

      return addedReply;
    } catch (err) {
      // 23503 is postgres error code for foreign key violations
      // https://www.postgresql.org/docs/current/errcodes-appendix.html

      if (err.code === '23503') {
        throw new NotFoundError('comment tidak ditemukan.');
      }
      throw new InvariantError(err.message);
    }
  }

  // async verifyCommentAvailability(commentId, ownerId) {
  //   const query = {
  //     text: 'SELECT owner, is_deleted from comments WHERE id = $1',
  //     values: [commentId],
  //   };

  //   const queryResult = await this._pool.query(query);

  //   if (!queryResult.rowCount) {
  //     throw new NotFoundError('resource tidak ditemukan');
  //   }

  //   if (queryResult.rows[0].owner !== ownerId) {
  //     throw new AuthorizationError('anda bukan merupakan owner comment');
  //   }

  //   if (queryResult.rows[0].is_deleted !== false) {
  //     throw new NotFoundError('comment sudah terhapus');
  //   }
  // }

  // async deleteComment(commentId, threadId) {
  //   const query = {
  //     text: 'UPDATE comments SET is_deleted = true WHERE id = $1 AND thread_id =
  // $2 RETURNING id',
  //     values: [commentId, threadId],
  //   };

  //   const queryResult = await this._pool.query(query);
  //   if (!queryResult.rowCount) {
  //     throw new NotFoundError('resource tidak ditemukan');
  //   }
  // }

  // async getCommentByThread(threadId) {
  //   const query = {
  //     text: `SELECT
  //               c.id,
  //               u.username,
  //               date,
  //               CASE WHEN is_deleted THEN
  //                 '**komentar telah dihapus**'
  //               ELSE
  //                 c.content
  //               END AS content
  //             FROM
  //               comments c
  //               JOIN users u ON c.owner = u.id
  //             WHERE
  //               c.thread_id = $1`,
  //     values: [threadId],
  //   };

  //   const queryResult = await this._pool.query(query);
  //   return queryResult.rows;
  // }
}

module.exports = ReplyRepositoryPostgres;
