const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  // @ts-ignore
  async addComment(addComment) {
    const id = `comment-${this._idGenerator()}`;
    const { content, owner, thread } = addComment;

    const query = {
      text: 'INSERT INTO comments (id, owner, content, thread_id) VALUES ($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, owner, content, thread],
    };
    try {
      const data = await this._pool.query(query);

      const addedComment = new AddedComment(data.rows[0]);

      return addedComment;
    } catch (err) {
      // 23503 is postgres error code for foreign key violations
      // https://www.postgresql.org/docs/current/errcodes-appendix.html
      // there are 2 foreign key in query, owner and thread_id
      // owner violation cant happen because of auth, because everything that go through auth
      // will already be inside the database
      // thus only possible cases (case in this case (lol)) is thread.

      if (err.code === '23503') {
        throw new NotFoundError('thread tidak ditemukan.');
      }
      throw new InvariantError(err.message);
    }
  }

  async verifyCommentAvailability(commentId, ownerId) {
    const query = {
      text: 'SELECT owner, is_deleted from comments WHERE id = $1',
      values: [commentId],
    };

    const queryResult = await this._pool.query(query);

    if (!queryResult.rowCount) {
      throw new NotFoundError('resource tidak ditemukan');
    }

    if (queryResult.rows[0].owner !== ownerId) {
      throw new AuthorizationError('anda bukan merupakan owner comment');
    }

    if (queryResult.rows[0].is_deleted !== false) {
      throw new NotFoundError('comment sudah terhapus');
    }
  }

  async deleteComment(commentId, threadId) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1 AND thread_id = $2 RETURNING id',
      values: [commentId, threadId],
    };

    const queryResult = await this._pool.query(query);
    if (!queryResult.rowCount) {
      throw new NotFoundError('resource tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
