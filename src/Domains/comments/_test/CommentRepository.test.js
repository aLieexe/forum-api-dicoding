const CommentRepository = require('../CommentRepository');

describe('Comment Repository Test', () => {
  it('throw error when invoking unimplemented abstract method', async () => {
    const commentRepo = new CommentRepository();
    await expect(commentRepo.addComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
