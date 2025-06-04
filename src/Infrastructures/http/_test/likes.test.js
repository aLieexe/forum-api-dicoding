const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const users = require('../../../Interfaces/http/api/users');

describe('likes http tests', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await ReplyTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and like a comment', async () => {
      const token = await UsersTableTestHelper.getAccessTokenForTestUser();
      const addedThread = await ThreadsTableTestHelper.addThread({});
      const addedComment = await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(201);
    });
    it('should response 404 when not resource doesnt exist', async () => {
      const token = await UsersTableTestHelper.getAccessTokenForTestUser();
      const addedThread = await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${'random non existant and never exist'}/likes`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(404);
    });

    it('should response 401 when not authorized', async () => {
      await UsersTableTestHelper.addUser({});
      const addedThread = await ThreadsTableTestHelper.addThread({});
      const addedComment = await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
      });

      expect(response.statusCode).toEqual(401);
    });
  });
});
