const CommentsWithReplies = require('../../Domains/comments/entities/CommentsWithReplies');

class GetThreadByIdUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentByThread(threadId) || [];
    const replies = await this._commentRepository.getRepliesFromComment(comments);

    const commentsWithReplies = new CommentsWithReplies(comments, replies);

    thread.comments = commentsWithReplies.comment;

    return thread;
  }
}

module.exports = GetThreadByIdUseCase;
