const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ToggleLikeUseCase = require('../ToggleLikeUseCase');

const LikeData = require('../../../Domains/likes/entities/LikeData');

describe('ToggleLikeUseCase', () => {
  it('Should orchestrate toggling a like based on comment id', async () => {
    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockLikeRepository.toggleLike = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkIfCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.checkIfThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const toggleLikeUseCase = new ToggleLikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await toggleLikeUseCase.execute('user-123', 'comment-123', 'thread-123');

    const expectedLikeData = new LikeData({
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
    });

    expect(mockThreadRepository.checkIfThreadExist).toBeCalledWith(expectedLikeData.threadId);
    expect(mockCommentRepository.checkIfCommentExist).toBeCalledWith(expectedLikeData.commentId);
    expect(mockLikeRepository.toggleLike).toBeCalledWith(expectedLikeData);
    expect(mockLikeRepository.toggleLike).toBeCalledTimes(1);
    expect(mockCommentRepository.checkIfCommentExist).toBeCalledTimes(1);
    expect(mockThreadRepository.checkIfThreadExist).toBeCalledTimes(1);
  });
});
