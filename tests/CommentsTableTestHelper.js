/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async cleanTable() {
    await pool.query('DELETE FROM comments');
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

};

module.exports = ThreadsTableTestHelper;
