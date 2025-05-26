const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');

describe('GetThreadById', () => {
  it('Should orchestrate the getting of a thread successfully', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      }));

    mockCommentRepository.getCommentByThread = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
      }]));

    mockCommentRepository.getRepliesFromComment = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'reply-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        comment_id: 'comment-123',
      },
      {
        id: 'reply-234',
        username: 'dicoding',
        date: '2021-09-11T07:22:33.555Z',
        content: 'sebuah comment dri dicoding',
        comment_id: 'comment-123',
      },
      ]));

    mockLikeRepository.getLikesCount = jest.fn()
      .mockImplementation(() => Promise.resolve(
        [{ comment_id: 'comment-123', count: '1' }],
      ));

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    const commentToCall = [{
      id: 'comment-123',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
    }];

    const thread = await getThreadByIdUseCase.execute('thread-123');
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentByThread).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getRepliesFromComment).toBeCalledWith(commentToCall);
    expect(mockLikeRepository.getLikesCount).toBeCalledWith(commentToCall);

    const expectedThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const expectedFormattedReply = [{
      id: 'reply-123',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
    },
    {
      id: 'reply-234',
      username: 'dicoding',
      date: '2021-09-11T07:22:33.555Z',
      content: 'sebuah comment dri dicoding',
    },
    ];

    const expectedComments = [{
      id: 'comment-123',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      likeCount: 1,
    }];

    expectedThread.comments = expectedComments;
    expectedThread.comments[0].replies = expectedFormattedReply;

    expect(thread).toEqual(expectedThread);
  });

  it('Comment should be empty array', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      }));
    mockCommentRepository.getCommentByThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.getRepliesFromComment = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    mockLikeRepository.getLikesCount = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    const thread = await getThreadByIdUseCase.execute('thread-123');
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentByThread).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getRepliesFromComment).toBeCalledWith([]);

    const expectedThread = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    expect(thread.id).toEqual(expectedThread.id);
    expect(thread.title).toEqual(expectedThread.title);
    expect(thread.body).toEqual(expectedThread.body);
    expect(thread.date).toEqual(expectedThread.date);
    expect(thread.username).toEqual(expectedThread.username);
    expect(thread.comments).toEqual([]);
  });
});
