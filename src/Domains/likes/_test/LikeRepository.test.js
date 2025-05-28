const UserRepository = require('../LikeRepository');

describe('UserRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const userRepository = new UserRepository();

    // Action and Assert
    await expect(userRepository.toggleLike({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.getLikesCount('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
