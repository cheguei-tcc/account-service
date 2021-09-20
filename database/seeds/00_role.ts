import { Knex } from 'knex';

const records = [
  { id: 1, name: 'super' },
  { id: 2, name: 'admin' },
  { id: 3, name: 'monitor' },
  { id: 4, name: 'student' },
  { id: 5, name: 'parent' },
];

export async function seed(knex: Knex): Promise<any> {
  // Upsert seed entries
  return await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex('role').insert(records),
  ]);
}
