const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const AddThread = require('../../../Domains/threads/entities/AddThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');

const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('Thread Repository Postgres test', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('add thread function', () => {
    it('should create a new thread in database', async () => {
      // stub func
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
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-rio123');
      expect(threads).toHaveLength(1);
    });
  });

  describe('GetThreadById', () => {
    it('should pass', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const fakeIdGenerator = () => '123';

      const commentRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const data = await commentRepository.getThreadById('thread-123');

      expect(data.id).toEqual('thread-123');
      expect(data.username).toEqual('dicoding');
      expect(data.title).toEqual('a thread title');
      expect(data.body).toEqual('a thread body');
    });

    it('should return not found', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const fakeIdGenerator = () => '123';

      const commentRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await expect(commentRepository.getThreadById('id that wont be found'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('CheckIfThreadExist', () => {
    it('should pass', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const fakeIdGenerator = () => '123';

      const commentRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepository.checkIfThreadExist('thread-123');
    });

    it('should return 404', async () => {
      await UsersTableTestHelper.addUser({});

      const fakeIdGenerator = () => '123';

      const commentRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await expect(commentRepository.checkIfThreadExist('thread-123'))
        .rejects.toThrow(NotFoundError);
    });
  });
});
