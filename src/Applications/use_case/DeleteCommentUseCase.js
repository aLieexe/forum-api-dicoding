class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(ownerId, threadId, commentId) {
    await this._commentRepository.verifyCommentAvailability(commentId, ownerId);
    await this._commentRepository.deleteComment(commentId, threadId);
  }
}

module.exports = DeleteCommentUseCase;
