class AddReply {
  constructor(payload, ownerId, commentId) {
    this._verifyPayload(payload, ownerId, commentId);

    const { content } = payload;

    this.content = content;
    this.owner = ownerId;
    this.comment = commentId;
  }

  _verifyPayload({ content }, ownerId, commentId) {
    if (!content || !ownerId || !commentId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof ownerId !== 'string' || typeof commentId !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
