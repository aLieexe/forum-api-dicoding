const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrate the creation of a comment successfully', async () => {
    const useCasePayload = {
      content: 'comment content',
    };

    const ownerId = 'user-123';
    const threadId = 'thread-123';

    const mockThread = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: ownerId,
    });

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    const addedThread = await addCommentUseCase.execute(useCasePayload, ownerId, threadId);

    expect(addedThread).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: 'comment content',
      owner: 'user-123',
    }));

    // verifikasi fungsi yang di mocc
    expect(mockCommentRepository.addComment)
      .toBeCalledWith(new AddComment(useCasePayload, ownerId, threadId));
  });
});
