const ReplyRepository = require('../ReplyRepository');

describe('Comment Repository Test', () => {
  it('throw error when invoking unimplemented abstract method', async () => {
    const commentRepo = new ReplyRepository();
    await expect(commentRepo.addReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepo.verifyReplyAvailability({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepo.deleteReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
