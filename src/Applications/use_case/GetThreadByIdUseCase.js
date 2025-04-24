class GetThreadByIdUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentByThread(threadId) || [];
    const replies = await this._commentRepository.getRepliesFromComment(comments);

    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.content,
      replies: replies.filter((reply) => reply.comment_id === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.content,
          date: reply.date,
          username: reply.username,
        })),
    }));

    thread.comments = formattedComments;

    return thread;
  }
}

module.exports = GetThreadByIdUseCase;
