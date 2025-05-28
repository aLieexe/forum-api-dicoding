const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

const container = require('../../container');
const createServer = require('../createServer');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      const token = await UsersTableTestHelper.getAccessTokenForTestUser();

      const requestPayload = {
        title: 'thread title',
        body: 'thread body',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe('when GET /threads', () => {
    it('should return 404', async () => {
      await UsersTableTestHelper.addUser({});
      const server = await createServer(container);

      const threadId = 'thread-123';

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });
      expect(response.statusCode).toEqual(404);
    });

    it('should return data correctly', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.addLikes({});
      const server = await createServer(container);

      const threadId = 'thread-123';

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
    });
  });
});
