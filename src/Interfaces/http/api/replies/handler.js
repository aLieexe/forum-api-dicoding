const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;
  }

  async postReplyHandler(request, h) {
    const { commentId, threadId } = request.params;

    const ownerId = request.auth.credentials.id;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

    const reply = await addReplyUseCase.execute(request.payload, ownerId, commentId, threadId);

    const response = h.response({
      status: 'success',
      data: {
        addedReply: reply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const { replyId } = request.params;
    const ownerId = request.auth.credentials.id;

    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute({ replyId, ownerId });
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
