const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const AddComment = require('../../../Domains/comments/entities/AddComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('Thread Repository Postgres test', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('add comment function', () => {
    it('should create a new commment in database', async () => {
      // need to make a user, create a new thread
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const fakeIdGenerator = () => '123';

      const commentToAdd = new AddComment({
        content: 'comment content',
      }, 'user-123', 'thread-123');

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(commentToAdd);
      const queryResult = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(queryResult).toHaveLength(1);
    });
  });

  describe('verifyCommentAvailability Function', () => {
    it('should pass when all is good', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123';

      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      commentRepository.verifyCommentAvailability('comment-123', 'user-123');
    });

    it('should throw NotFoundError when comment is not found', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123';

      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await expect(commentRepository.verifyCommentAvailability('unfounded comment', 'user-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorzationError when user doesnt have ownership', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123';

      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await expect(commentRepository.verifyCommentAvailability('comment-123', 'the unowning one'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should throw NotFoundError when comment is found, but already deleted (softly)', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({}, true);

      const fakeIdGenerator = () => '123';

      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await expect(commentRepository.verifyCommentAvailability('comment-123', 'user-123'))
        .rejects.toThrow(NotFoundError);
    });
  });
  describe('deleteCommentFunction', () => {
    it('should succeed / pass', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123';

      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepository.deleteComment('comment-123', 'thread-123');
    });

    it('should throw not found error', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123';

      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await expect(commentRepository.deleteComment('unfounded comment', 'user-123'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('getCommentByThread', () => {
    it('should pass', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123';

      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const result = await commentRepository.getCommentByThread('thread-123');
      const data = result[0];

      expect(data.id).toEqual('comment-123');
      expect(data.username).toEqual('dicoding');
      expect(data.content).toEqual('a content body');
    });
  });

  describe('checkIfCommentExist', () => {
    it('should pass with no issue', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123';

      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepository.checkIfCommentExist('comment-123');
    });

    it('should return 404 when comment not found', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123';

      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await expect(commentRepository.checkIfCommentExist('id that doesnt exist')).rejects.toThrow(NotFoundError);
    });
  });
});
