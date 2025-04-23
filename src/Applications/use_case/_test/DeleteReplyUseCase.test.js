const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrate the deletion of a reply successfully', async () => {
    const ownerId = 'owner-123';
    const replyId = 'reply-123';

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.verifyReplyAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Act
    await deleteReplyUseCase.execute({ replyId, ownerId });

    // Assert
    expect(mockReplyRepository.verifyReplyAvailability)
      .toHaveBeenCalledWith('reply-123', 'owner-123');
    expect(mockReplyRepository.deleteReply)
      .toHaveBeenCalledWith('reply-123');
  });
});
