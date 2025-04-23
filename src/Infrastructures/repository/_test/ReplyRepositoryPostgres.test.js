const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ReplyTestTableHelper = require('../../../../tests/ReplyTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

const pool = require('../../database/postgres/pool');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('Reply repository postgres', () => {
  afterEach(async () => {
    await ReplyTestTableHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('add reply', () => {
    it('should create a new reply in the database', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const replyToAdd = new AddReply({
        content: 'a reply content',
      }, 'user-123', 'comment-123');

      const fakeIdGenerator = () => '123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(replyToAdd);
      const queryResult = await ReplyTestTableHelper.findReplyById('reply-123');
      expect(queryResult).toHaveLength(1);
    });
  });

  describe('verify availability', () => {
    it('should pass successfully', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await ReplyTestTableHelper.addReply({});

      const fakeIdGenerator = () => '123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.verifyReplyAvailability('reply-123', 'user-123');
    });

    it('should not be found', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await ReplyTestTableHelper.addReply({});

      const fakeIdGenerator = () => '123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await expect(replyRepositoryPostgres.verifyReplyAvailability('a reply lost within the wood', 'user-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('user should not be authorized', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await ReplyTestTableHelper.addReply({});

      const fakeIdGenerator = () => '123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123', 'not user-123'))
        .rejects.toThrow(AuthorizationError);
    });

    it('already deleted', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await ReplyTestTableHelper.addReply({}, true);

      const fakeIdGenerator = () => '123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123', 'user-123'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('delete reply func', () => {
    it('should succeed', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await ReplyTestTableHelper.addReply({});

      const fakeIdGenerator = () => '123';

      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await replyRepository.deleteReply('reply-123');
    });

    it('should not be found', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await ReplyTestTableHelper.addReply({});

      const fakeIdGenerator = () => '123';

      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await expect(replyRepository.deleteReply('idk reply id')).rejects.toThrow(NotFoundError);
    });
  });
});
