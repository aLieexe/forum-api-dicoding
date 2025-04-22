const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ReplyTestTableHelper = require('../../../../tests/ReplyTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

const pool = require('../../database/postgres/pool');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

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

  it('should not create a new reply in the database', async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});

    const replyToAdd = new AddReply({
      content: 'a reply content',
    }, 'user-123', 'comment-123');

    const fakeIdGenerator = () => '123';

    const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

    await expect(replyRepositoryPostgres.addReply(replyToAdd)).rejects.toThrow(NotFoundError);
  });

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

    const replyRepository = new ReplyRepositoryPostgres(fakePool, fakeIdGenerator);
    const replyToAdd = {
      content: 'this is a reply',
      owner: 'user-inv123',
      comment: 'comment-xyz',
    };

    await expect(replyRepository.addReply(replyToAdd))
      .rejects
      .toThrow(InvariantError);
  });
});
