class AddedReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, owner } = payload;

    this.content = content;
    this.id = id;
    this.owner = owner;
  }

  _verifyPayload({ id, content, owner }) {
    if (!content || !owner || !id) {
      throw new Error('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof id !== 'string') {
      throw new Error('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedReply;
