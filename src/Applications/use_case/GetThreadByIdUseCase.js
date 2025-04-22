class GetThreadByIdUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentByThread(threadId) || [];

    await Promise.all(comments.map(async (comment) => {
      comment.replies = await this._replyRepository.getReplyByComment(comment.id);
    }));

    thread.comments = comments;

    return thread;
  }
}

module.exports = GetThreadByIdUseCase;
