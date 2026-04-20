/**
 * @param {import("knex").Knex} knex
 */
exports.up = async function up(knex) {
  const hasTable = await knex.schema.hasTable("water");

  if (!hasTable) {
    await knex.schema.createTable("water", (table) => {
      table.increments("id").primary();
      table.timestamp("hour", { useTz: false }).notNullable();
      table.integer("wlevel").notNullable();
      table.boolean("pump1").notNullable();
      table.boolean("pump2").notNullable();
      table.boolean("protect_pump1");
      table.boolean("protect_pump2");
      table.boolean("a1_contact_pump1");
      table.boolean("a1_contact_pump2");
      table.integer("state");
      table.boolean("pump_aux");
      table.integer("wvol");
    });
  }
};

/**
 * @param {import("knex").Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("water");
};
