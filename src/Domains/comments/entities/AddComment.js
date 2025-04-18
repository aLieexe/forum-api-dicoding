class AddComment {
  constructor(payload, ownerId, threadId) {
    this._verifyPayload(payload, ownerId, threadId);

    const { content } = payload;

    this.content = content;
    this.owner = ownerId;
    this.thread = threadId;
  }

  _verifyPayload({ content }, ownerId, threadId) {
    if (!content || !ownerId || !threadId) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof ownerId !== 'string' || typeof threadId !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
