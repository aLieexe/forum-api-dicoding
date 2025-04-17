const AddThreadsUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadsHandler(request, h) {
    const ownerId = request.auth.credentials.id;
    const addThreadsUseCase = this._container.getInstance(AddThreadsUseCase.name);

    const thread = await addThreadsUseCase.execute(request.payload, ownerId);

    const response = h.response({
      status: 'success',
      data: {
        addedThread: thread,
      },
    });

    response.code(201);

    return response;
  }
}

module.exports = ThreadsHandler;
