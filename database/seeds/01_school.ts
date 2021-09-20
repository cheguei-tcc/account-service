import { Knex } from 'knex';

const records = [
  {
    id: 1,
    name: 'INSTITUTO ADVENTISTA DE ENSINO',
    cnpj: '43.586.056/0001-82',
    address: 'Estrada de Itapecerica, 5859 - Jardim IAE, São Paulo',
  },
  {
    id: 2,
    name: 'COLEGIO NOVA GENTE',
    cnpj: '52.190.246/0003-39',
    address: 'Rua Dário da Silva, 195 - Cidade Ademar, São Paulo',
  },
];

export async function seed(knex: Knex): Promise<any> {
  // Upsert seed entries
  return await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex('school').insert(records),
  ]);
}
