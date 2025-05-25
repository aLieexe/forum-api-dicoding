const LikeData = require('../../Domains/likes/entities/LikeData');

class ToggleLikeUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userId, commentId, threadId) {
    const likeData = new LikeData({ userId, commentId, threadId });
    await this._commentRepository.checkIfCommentExist(commentId);
    await this._threadRepository.checkIfThreadExist(threadId);
    await this._likeRepository.toggleLike(likeData);
  }
}

module.exports = ToggleLikeUseCase;
