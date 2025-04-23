const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrate the creation of a comment successfully', async () => {
    const useCasePayload = {
      content: 'comment content',
    };

    const ownerIdToAdd = 'user-123';
    const threadIdToAdd = 'thread-123';

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation((addComment) => Promise.resolve(new AddedComment({
        id: 'comment-123',
        content: addComment.content,
        owner: addComment.owner,
      })));
    mockThreadRepository.checkIfThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addCommentUseCase
      .execute(useCasePayload, ownerIdToAdd, threadIdToAdd);

    expect(addedThread).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: 'comment content',
      owner: 'user-123',
    }));

    const expectedUseCasePayload = {
      content: 'comment content',
    };

    // verifikasi fungsi yang di mocc
    expect(mockCommentRepository.addComment)
      .toBeCalledWith(new AddComment(expectedUseCasePayload, 'user-123', 'thread-123'));
    expect(mockThreadRepository.checkIfThreadExist)
      .toBeCalledWith('thread-123');
  });
});
