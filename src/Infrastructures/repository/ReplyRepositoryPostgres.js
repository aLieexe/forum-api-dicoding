const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
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
    const data = await this._pool.query(query);

    const addedReply = new AddedReply(data.rows[0]);

    return addedReply;
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
}

module.exports = ReplyRepositoryPostgres;
