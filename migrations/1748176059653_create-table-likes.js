/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('likes', {
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    is_liked: {
      type: 'BOOLEAN',
      notNull: true,
      default: true,
    },
  });
  pgm.createIndex('likes', ['user_id', 'comment_id'], { name: 'idx_likes_user_comment' });

  pgm.addConstraint('likes', 'unique_interaction', {
    unique: ['user_id', 'comment_id'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
