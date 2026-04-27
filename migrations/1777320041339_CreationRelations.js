/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('relations', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()')
        },
        creation_id: {
            type: 'uuid',
            references: 'creations',
            onDelete: 'cascade',
            notNull: true
        },
        related_to_id: {
            type: 'uuid',
            references: 'creations',
            onDelete: 'cascade',
            notNull: true
        }
    }, {
        constraints: {
            unique: [['creation_id', 'related_to_id']]
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
