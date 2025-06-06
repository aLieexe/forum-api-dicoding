const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /comments', () => {
    it('should response 201 and created a persistent comments', async () => {
      // need to be logged in to comment.
      const token = await UsersTableTestHelper.getAccessTokenForTestUser();
      const mockedThread = await ThreadsTableTestHelper.addThread({});

      const threadId = mockedThread.id;

      const requestPayload = {
        content: 'comment content ',
      };

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe('when DELETE /comments/{commentId}', () => {
    it('should response 201 and delete a comment', async () => {
      // need to be logged in to comment.
      const token = await UsersTableTestHelper.getAccessTokenForTestUser();
      const mockedThread = await ThreadsTableTestHelper.addThread({});
      const mockedComment = await CommentsTableTestHelper.addComment({});

      const threadId = mockedThread.id;
      const commentId = mockedComment.id;

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
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
