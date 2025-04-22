class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute({ replyId, ownerId }) {
    await this._replyRepository.verifyReplyAvailability(replyId, ownerId);
    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
