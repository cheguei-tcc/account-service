import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('school', (table: Knex.TableBuilder) => {
    table.increments('id');
    table.string('cnpj').unique().notNullable();
    table.string('name').notNullable();
    table.string('address');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('user', (table: Knex.TableBuilder) => {
    table.increments('id');
    table.integer('school_id').references('id').inTable('school').nullable();
    table.integer('parent_id').references('id').inTable('user').nullable();
    table.string('name').notNullable();
    table.string('cpf').notNullable().unique();
    table.string('password').notNullable();
  });

  await knex.schema.createTable('classroom', (table: Knex.TableBuilder) => {
    table.increments('id');
    table.integer('school_id').references('id').inTable('school').notNullable();
    table.integer('student_id').references('id').inTable('user').nullable();
    table.string('name').notNullable();
    table.string('period');
    table.string('description');
  });

  await knex.schema.createTable('role', (table: Knex.TableBuilder) => {
    table.increments('id');
    table.string('name').notNullable().unique();
  });

  await knex.schema.createTable('user_role', (table: Knex.TableBuilder) => {
    table.increments('id');
    table.integer('user_id').references('id').inTable('user').notNullable();
    table.integer('role_id').references('id').inTable('role').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_role');
  await knex.schema.dropTableIfExists('role');
  await knex.schema.dropTableIfExists('classroom');
  await knex.schema.dropTableIfExists('user');
  await knex.schema.dropTableIfExists('school');
}
