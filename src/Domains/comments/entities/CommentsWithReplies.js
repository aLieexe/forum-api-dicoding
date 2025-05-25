class CommentsWithReplies {
  constructor(comments, replies, likes) {
    this._verifyPayload(comments, replies, likes);
    this.comment = this._formatComment(comments, replies, likes);
  }

  _verifyPayload(comments, replies, likes) {
    if (!comments || !replies || !likes) {
      throw new Error('COMMENTS_WITH_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (!(comments instanceof Array) || !(replies instanceof Array) || !(likes instanceof Array)) {
      throw new Error('COMMENTS_WITH_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _formatComment(comments, replies, likes) {
    const commentsWithReplies = comments.map((comment) => ({
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

    return commentsWithReplies.map((comment) => {
      const likeObj = likes.find((like) => like.comment_id === comment.id);
      const likeCount = parseInt(likeObj ? likeObj.count : 0, 10);

      return {
        ...comment,
        likeCount,
      };
    });
  }
}

module.exports = CommentsWithReplies;
