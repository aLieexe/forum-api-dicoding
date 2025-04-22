const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

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

  async verifyReplyAvailability(replyId, ownerId) {
    const query = {
      text: 'SELECT owner, is_deleted from reply WHERE id = $1',
      values: [replyId],
    };

    const queryResult = await this._pool.query(query);

    if (!queryResult.rowCount) {
      throw new NotFoundError('resource tidak ditemukan');
    }

    if (queryResult.rows[0].owner !== ownerId) {
      throw new AuthorizationError('anda bukan merupakan owner reply');
    }

    if (queryResult.rows[0].is_deleted !== false) {
      throw new NotFoundError('reply sudah terhapus');
    }
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE reply SET is_deleted = true WHERE id = $1 RETURNING id',
      values: [replyId],
    };

    const queryResult = await this._pool.query(query);
    if (!queryResult.rowCount) {
      throw new NotFoundError('resource tidak ditemukan');
    }
  }

  async getReplyByComment(commentId) {
    const query = {
      text: `SELECT
                r.id,
                u.username,
                date,
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
              ORDER BY r.date ASC`,
      values: [commentId],
    };

    const queryResult = await this._pool.query(query);

    return queryResult.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
