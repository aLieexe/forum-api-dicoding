const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, ownerId, threadId) {
    await this._threadRepository.checkIfThreadExist(threadId);
    const commentToAdd = new AddComment(useCasePayload, ownerId, threadId);
    const addedComment = await this._commentRepository.addComment(commentToAdd);
    return addedComment;
  }
}

module.exports = AddCommentUseCase;
