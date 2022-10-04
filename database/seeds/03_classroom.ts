import { Knex } from 'knex';

const cefsaSurrogateKey = '59.107.300/0001-17';
const marquesSurrogateKey = '54.199.070/0001-40';

const cefsaClassrooms = [
  {
    name: 'Turma 1',
    period: 'Matutino',
  },
  {
    name: 'Turma 2',
    period: 'Matutino',
  },
  {
    name: 'Turma 3',
    period: 'Matutino',
  },
];

const marquesClassrooms = [
  {
    name: 'Turma 1A',
    period: 'Matutino',
  },
  {
    name: 'Turma 1B',
    period: 'Matutino',
  },
  {
    name: 'Turma 2A',
    period: 'Matutino',
  },
  {
    name: 'Turma 2B',
    period: 'Matutino',
  },
  {
    name: 'Turma 2C',
    period: 'Matutino',
  },
];

export async function seed(knex: Knex): Promise<any> {
  // novagente classroom seed entries
  await knex.raw(`? ON CONFLICT DO NOTHING`, [
    knex('classroom').insert(
      marquesClassrooms.map((c) => ({
        ...c,
        school_id: knex('school')
          .select('id')
          .where({ cnpj: marquesSurrogateKey }),
      })),
    ),
  ]);

  // adventista classroom seed entries
  await knex.raw(`? ON CONFLICT DO NOTHING`, [
    knex('classroom').insert(
      cefsaClassrooms.map((c) => ({
        ...c,
        school_id: knex('school')
          .select('id')
          .where({ cnpj: cefsaSurrogateKey }),
      })),
    ),
  ]);
}
