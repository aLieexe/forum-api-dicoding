const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, ownerId, threadId) {
    const commentToAdd = new AddComment(useCasePayload, ownerId, threadId);
    const addedComment = await this._commentRepository.addComment(commentToAdd);
    return addedComment;
  }
}

module.exports = AddCommentUseCase;
