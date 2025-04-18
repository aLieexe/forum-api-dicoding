/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');
const AddedThread = require('../src/Domains/threads/entities/AddedThread');

const ThreadsTableTestHelper = {
  async cleanTable() {
    await pool.query('DELETE FROM threads');
  },

  async findThreadsById(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async addThread({
    title = 'a thread title', body = 'a thread body',
  }, ownerId = 'user-123') {
    const id = 'thread-123';

    const query = {
      text: 'INSERT INTO threads (id, owner, body, title) VALUES ($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, ownerId, body, title],
    };

    const data = await pool.query(query);
    const addedThreads = new AddedThread(data.rows[0]);

    return addedThreads;
  },

};

module.exports = ThreadsTableTestHelper;
