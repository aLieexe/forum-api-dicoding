const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the deletion of a comment successfully', async () => {
    const ownerId = 'owner-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deletecommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Act
    await deletecommentUseCase.execute(ownerId, threadId, commentId);

    // Assert
    expect(mockCommentRepository.verifyCommentAvailability)
      .toHaveBeenCalledWith(commentId, ownerId);
    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(commentId, threadId);
  });
});
