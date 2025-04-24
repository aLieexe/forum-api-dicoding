const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  // @ts-ignore
  // thread not found will be handled by threadRepo.checkThreadAvailability before execution
  // thus no need to check for fkey error as it shouldnt happen
  async addComment(addComment) {
    const id = `comment-${this._idGenerator()}`;
    const { content, owner, thread } = addComment;

    const query = {
      text: 'INSERT INTO comments (id, owner, content, thread_id) VALUES ($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, owner, content, thread],
    };

    const data = await this._pool.query(query);
    const addedComment = new AddedComment(data.rows[0]);
    return addedComment;
  }

  async checkIfCommentExist(commentId) {
    const query = {
      text: 'SELECT id from comments where id = $1',
      values: [commentId],
    };

    const data = await this._pool.query(query);
    if (data.rowCount === 0) {
      throw new NotFoundError('thread tidak ditemukan');
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

  async getCommentByThread(threadId) {
    const query = {
      text: `SELECT
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
                c.thread_id = $1
              ORDER BY c.date ASC`,
      values: [threadId],
    };

    const queryResult = await this._pool.query(query);
    return queryResult.rows;
  }

  async getRepliesFromComment(comments) {
    const commentsId = [];

    comments.forEach((comment) => {
      commentsId.push(comment.id);
    });

    const query = {
      text: `SELECT
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
            ORDER BY
              r.date ASC
            `,
      values: [commentsId],
    };

    const data = await this._pool.query(query);
    if (data.rowCount === 0) {
      return [];
    }

    return data.rows;
  }
}

module.exports = CommentRepositoryPostgres;
