const AddComment = require('../AddComment');

describe('AddComment', () => {
  it('should throw an error when did not contain needed property', () => {
    const payload = {
      content: 'comment content',
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meed data specification', () => {
    const payload = {
      content: 12123,
    };

    const ownerId = 'rio husband';
    const threadId = 'thread id oi';

    expect(() => new AddComment(payload, ownerId, threadId)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a new Add Comment instance correcly', () => {
    const payload = {
      content: 'comment content',
    };

    const ownerId = 'rio husband';
    const threadId = 'thread id oi';

    const expectedPayload = {
      content: 'comment content',
    };

    const expectedOwnerId = 'rio husband';
    const expectedThreadId = 'thread id oi';
    const addComment = new AddComment(payload, ownerId, threadId);

    expect(addComment.content).toEqual(expectedPayload.content);
    expect(addComment.owner).toEqual(expectedOwnerId);
    expect(addComment.thread).toEqual(expectedThreadId);
  });
});
