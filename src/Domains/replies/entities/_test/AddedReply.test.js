const AddedReply = require('../AddedReply');

describe('AddedReply', () => {
  it('should throw an error when did not contain needed property', () => {
    const payload = {
      content: 'payload content',
      owner: 'rio husband',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meed data specification', () => {
    const payload = {
      content: 'reply content',
      owner: 'rio husband',
      id: 1201,
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a new Added Content correcly', () => {
    const payload = {
      content: 'test title',
      owner: 'rio husband',
      id: 'rio is wife',
    };

    const expectedPayload = {
      content: 'test title',
      owner: 'rio husband',
      id: 'rio is wife',
    };

    const addedReply = new AddedReply(payload);

    expect(addedReply.id).toEqual(expectedPayload.id);
    expect(addedReply.owner).toEqual(expectedPayload.owner);
    expect(addedReply.content).toEqual(expectedPayload.content);
  });
});
