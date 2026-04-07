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

    pgm.addColumn('creations', {
        created_at: {
            type: 'TIMESTAMPTZ',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP')
        }
    })

    pgm.alterColumn('users', 'created_at', {
        type: 'TIMESTAMPTZ',
        notNull: true,
        default: pgm.func('CURRENT_TIMESTAMP')
    })

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => { };
