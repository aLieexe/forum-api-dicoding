/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      references: 'users(id)',
      notNull: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMPTZ',
      default: pgm.func('NOW()'),
      notNull: true,

    },
    is_deleted: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      references: 'threads(id)',
      notNull: true,
    },

  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
