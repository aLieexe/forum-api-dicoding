const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, ownerId, commentId, threadId) {
    const replyToAdd = new AddReply(useCasePayload, ownerId, commentId);
    await this._threadRepository.checkIfThreadExist(threadId);
    const addedReply = await this._replyRepository.addReply(replyToAdd);
    return addedReply;
  }
}

module.exports = AddReplyUseCase;
