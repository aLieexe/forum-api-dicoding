const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddReplyUseCase = require('../AddReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrate the creation of a reply successfully', async () => {
    const useCasePayload = {
      content: 'reply content',
    };

    const ownerIdToAdd = 'user-123';
    const threadIdToAdd = 'thread-123';
    const commentIdToAdd = 'comment-123';

    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockReplyRepository.addReply = jest.fn()
      .mockImplementation((addReply) => Promise.resolve(new AddedReply({
        id: 'reply-123',
        content: addReply.content,
        owner: addReply.owner,
      })));

    mockThreadRepository.checkIfThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkIfCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const addedReply = await addReplyUseCase
      .execute(useCasePayload, ownerIdToAdd, commentIdToAdd, threadIdToAdd);

    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      content: 'reply content',
      owner: 'user-123',
    }));

    const expectedUseCasePayload = {
      content: 'reply content',
    };

    // verifikasi fungsi yang di mocc
    expect(mockReplyRepository.addReply)
      .toBeCalledWith(new AddReply(expectedUseCasePayload, 'user-123', 'comment-123'));
    expect(mockThreadRepository.checkIfThreadExist)
      .toBeCalledWith('thread-123');
    expect(mockCommentRepository.checkIfCommentExist)
      .toBeCalledWith('comment-123');
  });
});
