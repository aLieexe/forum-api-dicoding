const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const ownerId = request.auth.credentials.id;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const comment = await addCommentUseCase.execute(request.payload, ownerId, threadId);

    const response = h.response({
      status: 'success',
      data: {
        addedComment: comment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = CommentsHandler;
