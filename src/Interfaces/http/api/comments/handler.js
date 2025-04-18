const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

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

  async deleteCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const ownerId = request.auth.credentials.id;

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(ownerId, threadId, commentId);

    const response = h.response({
      status: 'success',
    });

    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
