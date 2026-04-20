/**
 * @param {import("knex").Knex} knex
 */
exports.up = async function up(knex) {
  const hasTable = await knex.schema.hasTable("water");
  if (!hasTable) return;

  await knex.schema.alterTable("water", (table) => {
    table.index(["hour"], "idx_water_hour");
  });
};

/**
 * @param {import("knex").Knex} knex
 */
exports.down = async function down(knex) {
  const hasTable = await knex.schema.hasTable("water");
  if (!hasTable) return;

  await knex.schema.alterTable("water", (table) => {
    table.dropIndex(["hour"], "idx_water_hour");
  });
};
