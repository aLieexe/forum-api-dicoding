const AddedThreads = require('../AddedThread');

describe('AddedThreads', () => {
  it('should throw an error when did not contain needed property', () => {
    const payload = {
      title: 'test title',
      owner: 'rio husband',
    };

    expect(() => new AddedThreads(payload)).toThrowError('ADDED_THREADS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meed data specification', () => {
    const payload = {
      title: 'test title',
      owner: 'rio husband',
      id: 1201,
    };

    expect(() => new AddedThreads(payload)).toThrowError('ADDED_THREADS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a new Added Threads correcly', () => {
    const payload = {
      title: 'test title',
      owner: 'rio husband',
      id: 'rio is wife',
    };

    const expectedPayload = {
      title: 'test title',
      owner: 'rio husband',
      id: 'rio is wife',
    };

    const addedThreads = new AddedThreads(payload);

    expect(addedThreads.id).toEqual(expectedPayload.id);
    expect(addedThreads.owner).toEqual(expectedPayload.owner);
    expect(addedThreads.title).toEqual(expectedPayload.title);
  });
});
