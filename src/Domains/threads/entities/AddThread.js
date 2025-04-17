class AddThreads {
  constructor(payload, ownerId) {
    this._verifyPayload(payload, ownerId);
    const { title, body } = payload;

    this.ownerId = ownerId;
    this.title = title;
    this.body = body;
  }

  _verifyPayload({ title, body }, ownerId) {
    if (!title || !body || !ownerId) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof ownerId !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThreads;
