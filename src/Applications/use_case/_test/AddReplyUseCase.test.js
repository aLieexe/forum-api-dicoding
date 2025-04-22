const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddReplyUseCase = require('../AddReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrate the creation of a reply successfully', async () => {
    const useCasePayload = {
      content: 'reply content',
    };

    const ownerId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const mockReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: ownerId,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();

    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReply));
    mockThreadRepository.checkIfThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
    });

    const addedReply = await addReplyUseCase.execute(useCasePayload, ownerId, commentId, threadId);

    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      content: 'reply content',
      owner: 'user-123',
    }));

    // verifikasi fungsi yang di mocc
    expect(mockReplyRepository.addReply)
      .toBeCalledWith(new AddReply(useCasePayload, ownerId, commentId));
    expect(mockThreadRepository.checkIfThreadExist)
      .toBeCalledWith(threadId);
  });
});
