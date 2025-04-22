const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');

const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('replies http tests', () => {
  describe('POST /replies', () => {
    afterEach(async () => {
      await ReplyTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });
    it('should return 201, and created replies', async () => {
      const token = await UsersTableTestHelper.getAccessTokenForTestUser();
      const addedThread = await ThreadsTableTestHelper.addThread({});
      const addedComment = await CommentsTableTestHelper.addComment({});

      const requestPayload = {
        content: 'Reply comment',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(201);
    });
  });
});
