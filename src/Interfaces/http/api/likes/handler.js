const ToggleLikeUseCase = require('../../../../Applications/use_case/ToggleLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
  }

  async putLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const userId = request.auth.credentials.id;

    const toggleLikeUseCase = this._container.getInstance(ToggleLikeUseCase.name);

    await toggleLikeUseCase.execute(userId, commentId, threadId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
