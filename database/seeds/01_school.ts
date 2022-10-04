import { Knex } from 'knex';

const records = [
  {
    id: 1,
    name: 'Centro Educacional Da Fundação Salvador Arena',
    cnpj: '59.107.300/0001-17',
    address: 'Estrada dos Alvarengas, 4001 - Alvarenga, São Bernardo',
    latitude: '-23.7377699',
    longitude: '-46.5859311'
  },
  {
    id: 2,
    name: 'Colégio Marquês de Monte Alegre',
    cnpj: '54.199.070/0001-40',
    address: 'R. Coriolano Durand, 515 - São Paulo',
    latitude: '-23.6527437',
    longitude: '-46.6578092'
  },
];

export async function seed(knex: Knex): Promise<any> {
  // Upsert seed entries
  return await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex('school').insert(records),
  ]);
}
