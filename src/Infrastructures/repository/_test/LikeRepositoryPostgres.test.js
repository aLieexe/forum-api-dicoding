const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikesTableTestHelper');

const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

const pool = require('../../database/postgres/pool');
const LikeData = require('../../../Domains/likes/entities/LikeData');

describe('Reply repository postgres', () => {
  afterEach(async () => {
    await LikeTableTestHelper.cleanTable();
    await ReplyTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('ToggleLike', () => {
    it('should add a new like on the database', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const comments = await CommentsTableTestHelper.addComment({});

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      const likeData = new LikeData({
        commentId: 'comment-123',
        userId: 'user-123',
        threadId: 'thread-123',
      });
      await likeRepositoryPostgres.toggleLike(likeData);
      const result = await likeRepositoryPostgres.getLikesCount([comments]);
      expect(result[0].count).toStrictEqual('1');
    });
  });

  describe('GetLikesCount', () => {
    it('should get the correct number of like', async () => {
      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'lie' });
      await ThreadsTableTestHelper.addThread({});
      const comments = await CommentsTableTestHelper.addComment({});

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      const likeData = new LikeData({
        commentId: 'comment-123',
        userId: 'user-123',
        threadId: 'thread-123',
      });

      const likeData2 = new LikeData({
        commentId: 'comment-123',
        userId: 'user-234',
        threadId: 'thread-123',
      });

      // add two likes
      await likeRepositoryPostgres.toggleLike(likeData);
      await likeRepositoryPostgres.toggleLike(likeData2);

      const result = await likeRepositoryPostgres.getLikesCount([comments]);
      expect(result[0].count).toStrictEqual('2');
    });
  });
});
