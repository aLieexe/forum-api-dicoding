const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const AddComment = require('../../../Domains/comments/entities/AddComment');
// const AddThread = require('../../../Domains/threads/entities/AddThread');
// const RegisterUser = require('../../../Domains/users/entities/RegisterUser');

// const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
// const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
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

    it('should not create a new comment due to thread not being found', async () => {
      // need to make a user, create a new thread
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const fakeIdGenerator = () => '123';

      const commentToAdd = new AddComment({
        content: 'comment content',
      }, 'user-rio123', 'thread-r23');

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await expect(commentRepositoryPostgres.addComment(commentToAdd))
        .rejects
        .toThrowError(new NotFoundError('thread tidak ditemukan.'));
    });

    // i dont think this test is necessary, i cant think of a scenario where this error ever happen
    it('should throw InvariantError when database throws unexpected error', async () => {
      const fakeIdGenerator = () => 'inv123';
      const fakePool = {
        query: jest.fn(() => {
          const err = new Error('some db error');
          // @ts-ignore
          err.code = '42069'; // just whatever code as long as its not 23503
          throw err;
        }),
      };

      const commentRepository = new CommentRepositoryPostgres(fakePool, fakeIdGenerator);
      const commentToAdd = {
        content: 'This is a comment',
        owner: 'user-inv123',
        thread: 'thread-xyz',
      };

      await expect(commentRepository.addComment(commentToAdd))
        .rejects
        .toThrow(InvariantError);
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
});
