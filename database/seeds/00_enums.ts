import { Knex } from 'knex';

const roleRecords = [
  { id: 1, name: 'super' },
  { id: 2, name: 'admin' },
  { id: 3, name: 'monitor' },
  { id: 4, name: 'student' },
  { id: 5, name: 'parent' },
];

const genderRecords = [
  { id: 1, name: 'male' },
  { id: 2, name: 'female' },
];


export async function seed(knex: Knex): Promise<any> {
  // Upsert seed entries

  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex('role').insert(roleRecords),
  ]);

  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex('gender').insert(genderRecords),
  ]);
}
