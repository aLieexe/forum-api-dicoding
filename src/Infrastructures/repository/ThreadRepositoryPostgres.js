const AddedThreads = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  // @ts-ignore
  async addThreads(addThreads) {
    const id = `thread-${this._idGenerator()}`;
    const { ownerId, body, title } = addThreads;

    const query = {
      text: 'INSERT INTO threads (id, owner, body, title) VALUES ($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, ownerId, body, title],
    };

    const data = await this._pool.query(query);
    const addedThreads = new AddedThreads(data.rows[0]);

    return addedThreads;
  }
}

module.exports = ThreadRepositoryPostgres;
