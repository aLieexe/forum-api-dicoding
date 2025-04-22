const AddReply = require('../AddReply');

describe('AddReply', () => {
  it('should throw an error when did not contain needed property', () => {
    const payload = {
      content: 'comment content',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meed data specification', () => {
    const payload = {
      content: 12123,
    };

    const ownerId = 'rio husband';
    const commentId = 'comment-123';

    expect(() => new AddReply(payload, ownerId, commentId)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a new Add Comment instance correcly', () => {
    const payload = {
      content: 'comment content',
    };

    const ownerId = 'rio husband';
    const commentId = 'comment-123';

    const expectedPayload = {
      content: 'comment content',
    };

    const expectedOwnerId = 'rio husband';
    const expectedCommentId = 'comment-123';
    const addReply = new AddReply(payload, ownerId, commentId);

    expect(addReply.content).toEqual(expectedPayload.content);
    expect(addReply.owner).toEqual(expectedOwnerId);
    expect(addReply.comment).toEqual(expectedCommentId);
  });
});
