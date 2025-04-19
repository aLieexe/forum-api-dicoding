const AddThreadsUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadByIdUseCase = require('../../../../Applications/use_case/GetThreadByIdUseCase');

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

  async getThreadByIdHandler(request, h) {
    const { threadId } = request.params;
    const getThreadByIdUseCase = this._container.getInstance(GetThreadByIdUseCase.name);

    const thread = await getThreadByIdUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });

    response.code(200);

    return response;
  }
}

module.exports = ThreadsHandler;
