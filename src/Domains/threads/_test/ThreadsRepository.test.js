const ThreadRepository = require('../ThreadRepository');

describe('Thread Repository Test', () => {
  it('throw error when invoking unimplemented abstract method', async () => {
    const threadRepo = new ThreadRepository();
    await expect(threadRepo.addThreads({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
