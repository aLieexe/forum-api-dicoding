const AddThreads = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, ownerId) {
    const addThreads = new AddThreads(useCasePayload, ownerId);
    const addedThreads = await this._threadRepository.addThreads(addThreads);

    return addedThreads;
  }
}
module.exports = AddThreadUseCase;
