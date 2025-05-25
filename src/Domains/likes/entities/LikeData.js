class LikeData {
  constructor(payload) {
    this._verifyPayload(payload);

    const { commentId, threadId, userId } = payload;

    this.commentId = commentId;
    this.threadId = threadId;
    this.userId = userId;
  }

  _verifyPayload({ commentId, threadId, userId }) {
    if (!commentId || !threadId || !userId) {
      throw new Error('LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof threadId !== 'string' || typeof userId !== 'string') {
      throw new Error('LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeData;
