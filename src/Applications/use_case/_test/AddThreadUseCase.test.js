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

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThreads = jest.fn()
      .mockImplementation((addThread) => Promise.resolve(new AddedThread({
        id: 'thread-123',
        title: addThread.title,
        owner: addThread.ownerId,
      })));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(useCasePayload, 'user-123');

    const expectedUseCasePayload = {
      body: 'thread payload body',
      title: 'thread payload title',
    };

    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: expectedUseCasePayload.title,
      owner: 'user-123',
    }));

    // verifikasi fungsi yang di mocc
    expect(mockThreadRepository.addThreads).toBeCalledWith(new AddThreads(expectedUseCasePayload, 'user-123'));
  });
});
