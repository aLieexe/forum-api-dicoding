const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThreads = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrate the creation of a thread successfully', async () => {
    const useCasePayload = {
      body: 'thread payload body',
      title: 'thread payload title',
    };

    const ownerId = 'user-123';

    const mockThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: ownerId,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThreads = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(useCasePayload, ownerId);

    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: ownerId,
    }));

    // verifikasi fungsi yang di mocc
    expect(mockThreadRepository.addThreads).toBeCalledWith(new AddThreads(useCasePayload, ownerId));
  });
});
