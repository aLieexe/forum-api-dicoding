class GetThreadByIdUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentByThread(threadId) || [];
    thread.comments = comments;

    return thread;
  }
}

module.exports = GetThreadByIdUseCase;
