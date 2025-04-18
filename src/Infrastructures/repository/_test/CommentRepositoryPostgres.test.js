const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');

const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

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
      // need to make a user, login it, create a new thread, then we can add comment
      const fakeIdGenerator = () => 'rio123';

      // user setup
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const threadToAdd = new AddThread({
        title: 'rio is my wife',
        body: 'legit my wife no cap',
      }, 'user-rio123');

      await threadRepositoryPostgres.addThreads(threadToAdd);

      const commentToAdd = new AddComment({
        content: 'comment content',
      }, 'user-rio123', 'thread-rio123');

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(commentToAdd);
      const queryResult = await CommentsTableTestHelper.findCommentsById('comment-rio123');
      expect(queryResult).toHaveLength(1);
    });

    it('should not create a new comment due to thread not being found', async () => {
      // need to make a user, login it, create a new thread, then we can add comment
      const fakeIdGenerator = () => 'rio123';

      // user setup
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const threadToAdd = new AddThread({
        title: 'rio is my wife',
        body: 'legit my wife no cap',
      }, 'user-rio123');

      await threadRepositoryPostgres.addThreads(threadToAdd);

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
});
