const AddThreads = require('../AddThread');

describe('AddThreads', () => {
  it('should throw an error when did not contain needed property', () => {
    const payload = {
      title: 'test title',
      body: 'rio my wife',
    };

    expect(() => new AddThreads(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meed data specification', () => {
    const payload = {
      title: 'test title',
      body: 1201,
    };

    const ownerId = 'rio husband';

    expect(() => new AddThreads(payload, ownerId)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a new Add Threads instance correcly', () => {
    const payload = {
      title: 'test title',
      body: 'rio is wife',
    };

    const ownerId = 'rio husband';

    const expectedPayload = {
      title: 'test title',
      body: 'rio is wife',
    };

    const expectedOwnerId = 'rio husband';

    const addedThreads = new AddThreads(payload, ownerId);

    expect(addedThreads.ownerId).toEqual(expectedOwnerId);
    expect(addedThreads.body).toEqual(expectedPayload.body);
    expect(addedThreads.title).toEqual(expectedPayload.title);
  });
});
