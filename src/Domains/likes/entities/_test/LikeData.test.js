const LikeData = require('../LikeData');

describe('LikeData', () => {
  it('should throw an error when did not contain needed property', () => {
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
    };

    expect(() => new LikeData(payload)).toThrowError('LIKE_DATA.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meed data specification', () => {
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 123,
    };

    expect(() => new LikeData(payload)).toThrowError('LIKE_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a new Added Content correcly', () => {
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
    };

    const expectedPayload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
    };

    const likeData = new LikeData(payload);

    expect(likeData.commentId).toEqual(expectedPayload.commentId);
    expect(likeData.userId).toEqual(expectedPayload.userId);
    expect(likeData.threadId).toEqual(expectedPayload.threadId);
  });
});
