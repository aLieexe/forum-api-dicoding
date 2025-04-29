class CommentsWithReplies {
  constructor(comments, replies) {
    this._verifyPayload(comments, replies);
    this.comment = this._formatComment(comments, replies);
  }

  _verifyPayload(comments, replies) {
    if (!comments || !replies) {
      throw new Error('COMMENTS_WITH_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (!(comments instanceof Array) || !(replies instanceof Array)) {
      throw new Error('COMMENTS_WITH_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _formatComment(comments, replies) {
    return comments.map((comment) => ({
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
  }
}

module.exports = CommentsWithReplies;
