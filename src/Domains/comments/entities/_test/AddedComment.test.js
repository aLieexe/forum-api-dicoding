const AddedComment = require('../AddedComment');

describe('AddedComment', () => {
  it('should throw an error when did not contain needed property', () => {
    const payload = {
      content: 'payload content',
      owner: 'rio husband',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meed data specification', () => {
    const payload = {
      content: 'thread content',
      owner: 'rio husband',
      id: 1201,
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
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

    const addedComment = new AddedComment(payload);

    expect(addedComment.id).toEqual(expectedPayload.id);
    expect(addedComment.owner).toEqual(expectedPayload.owner);
    expect(addedComment.content).toEqual(expectedPayload.content);
  });
});
