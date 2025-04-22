const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');

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

  // async deleteReplyHandler(request, h) {

  // }
}

module.exports = RepliesHandler;
