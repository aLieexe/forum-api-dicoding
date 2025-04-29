const CommentsWithReplies = require('../CommentsWithReplies');

describe('CommentsWithReplies', () => {
  it('should throw an error when did not contain needed property', () => {
    const comments = [];

    expect(() => new CommentsWithReplies(comments)).toThrowError('COMMENTS_WITH_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meed data specification', () => {
    const comments = [];
    const replies = 123123;

    expect(() => new CommentsWithReplies(comments, replies)).toThrowError('COMMENTS_WITH_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a new Added Content correcly', () => {
    const comments = [
      {
        id: 'comment-vHoV-mh_x06W8kexwk7gU',
        username: 'dicoding',
        date: '2025-04-29T06:53:37.294Z',
        content: 'sebuah comment',
      },
    ];
    const replies = [
      {
        id: 'reply-QCPXJQFqiH6oFmbIblj4s',
        username: 'dicoding',
        date: '2025-04-29T06:53:52.976Z',
        comment_id: 'comment-vHoV-mh_x06W8kexwk7gU',
        content: 'sebuah balasan',
      },
      {
        id: 'reply-Q8TrMFkz8IKIEMv1qH9Gg',
        username: 'dicoding',
        date: '2025-04-29T06:53:53.506Z',
        comment_id: 'comment-vHoV-mh_x06W8kexwk7gU',
        content: 'sebuah balasan',
      }];
    const addedComment = new CommentsWithReplies(comments, replies);

    const expectedComment = {
      id: 'comment-vHoV-mh_x06W8kexwk7gU',
      username: 'dicoding',
      date: '2025-04-29T06:53:37.294Z',
      content: 'sebuah comment',
    };

    expect(addedComment.comment[0].id).toEqual(expectedComment.id);
    expect(addedComment.comment[0].username).toEqual(expectedComment.username);
    expect(addedComment.comment[0].date).toEqual(expectedComment.date);
    expect(addedComment.comment[0].content).toEqual(expectedComment.content);
    expect(addedComment.comment[0].replies.length).toEqual(2);
  });
});
