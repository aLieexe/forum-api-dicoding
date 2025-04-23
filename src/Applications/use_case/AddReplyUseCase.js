const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, ownerId, commentId, threadId) {
    await this._threadRepository.checkIfThreadExist(threadId);
    await this._commentRepository.checkIfCommentExist(commentId);

    const replyToAdd = new AddReply(useCasePayload, ownerId, commentId);
    const addedReply = await this._replyRepository.addReply(replyToAdd);
    return addedReply;
  }
}

module.exports = AddReplyUseCase;
