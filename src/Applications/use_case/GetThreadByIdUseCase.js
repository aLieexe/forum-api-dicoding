const CommentsWithReplies = require('../../Domains/comments/entities/CommentsWithReplies');

class GetThreadByIdUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentByThread(threadId) || [];
    const replies = await this._commentRepository.getRepliesFromComment(comments);
    const likes = await this._likeRepository.getLikesCount(comments);

    const commentsWithReplies = new CommentsWithReplies(comments, replies, likes);

    thread.comments = commentsWithReplies.comment;

    return thread;
  }
}

module.exports = GetThreadByIdUseCase;
