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
  pgm.createTable("progress_series", {
    id: { type: "serial", primaryKey: true },
    id_serie: {
      type: "integer",
      notNull: true,
      references: '"series"',
      onDelete: "CASCADE",
    },
    seasons_now: { type: "integer", notNull: true, default: 1 },
    episodes_now: { type: "integer", notNull: true, default: 0 },
    status: { type: "varchar(50)", notNull: true, default: "Quero assistir" },
    note: { type: "numeric(3, 1)", notNull: false },
    begin: {
      type: "timestamp",
      notNull: false,
    },
    streaming: { type: "varchar(150)", notNull: true, unique: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
