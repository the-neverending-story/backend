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
    pgm.createTable('creations', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()')
        },
        name: {
            type: 'text',
            notNull: true,
            unique: true
        },
        category: {
            type: 'text',
            notNull: true,
        },
        content: {
            type: 'text',
            notNull: true
        },
        author_id: {
            type: 'uuid',
            references: 'users',
            onDelete: 'cascade',
            notNull: true
        }
    });
}
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => { };
