const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');

const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('replies http tests', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ReplyTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('POST /replies', () => {
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

  describe('when DELETE /replies/{replyId}', () => {
    it('should response 200 and delete a comment', async () => {
      // need to be logged in to comment.
      const token = await UsersTableTestHelper.getAccessTokenForTestUser();
      const mockedThread = await ThreadsTableTestHelper.addThread({});
      const mockedComment = await CommentsTableTestHelper.addComment({});
      const mockedReply = await ReplyTableTestHelper.addReply({});

      const threadId = mockedThread.id;
      const commentId = mockedComment.id;
      const replyId = mockedReply.id;

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
