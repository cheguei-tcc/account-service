import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', (table: Knex.TableBuilder) => {
    table.dropForeign('school_id');
    table.dropForeign('parent_id');

    table
      .foreign('school_id')
      .references('id')
      .inTable('school')
      .onDelete('CASCADE');

    table
      .foreign('parent_id')
      .references('id')
      .inTable('user')
      .onDelete('CASCADE');
  });

  await knex.schema.alterTable(
    'student_classroom',
    (table: Knex.TableBuilder) => {
      table.dropForeign('user_id');
      table.dropForeign('classroom_id');

      table
        .foreign('user_id')
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');

      table
        .foreign('classroom_id')
        .references('id')
        .inTable('classroom')
        .onDelete('CASCADE');
    },
  );

  await knex.schema.alterTable('classroom', (table: Knex.TableBuilder) => {
    table.dropForeign('school_id');

    table
      .foreign('school_id')
      .references('id')
      .inTable('school')
      .onDelete('CASCADE');
  });

  await knex.schema.alterTable('user_role', (table: Knex.TableBuilder) => {
    table.dropForeign('user_id');
    table.dropForeign('role_id');

    table
      .foreign('user_id')
      .references('id')
      .inTable('user')
      .onDelete('CASCADE');
    table
      .foreign('role_id')
      .references('id')
      .inTable('role')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', (table: Knex.TableBuilder) => {
    table.dropForeign('school_id');
    table.dropForeign('parent_id');

    table.foreign('school_id').references('id').inTable('school');
    table.foreign('parent_id').references('id').inTable('user');
  });

  await knex.schema.alterTable(
    'student_classroom',
    (table: Knex.TableBuilder) => {
      table.dropForeign('user_id');
      table.dropForeign('classroom_id');

      table.foreign('user_id').references('id').inTable('user');
      table.foreign('classroom_id').references('id').inTable('classroom');
    },
  );

  await knex.schema.alterTable('classroom', (table: Knex.TableBuilder) => {
    table.dropForeign('school_id');

    table.foreign('school_id').references('id').inTable('school');
  });

  await knex.schema.alterTable('user_role', (table: Knex.TableBuilder) => {
    table.dropForeign('user_id');
    table.dropForeign('role_id');

    table.foreign('user_id').references('id').inTable('user');
    table.foreign('role_id').references('id').inTable('role');
  });
}
