import { Knex } from 'knex';

const adventistaSurrogateKey = '43.586.056/0001-82';
const novaGenteSurrogateKey = '52.190.246/0003-39';

const adventistaClassrooms = [
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

const novaGenteClassrooms = [
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
      novaGenteClassrooms.map((c) => ({
        ...c,
        school_id: knex('school')
          .select('id')
          .where({ cnpj: novaGenteSurrogateKey }),
      })),
    ),
  ]);

  // adventista classroom seed entries
  await knex.raw(`? ON CONFLICT DO NOTHING`, [
    knex('classroom').insert(
      adventistaClassrooms.map((c) => ({
        ...c,
        school_id: knex('school')
          .select('id')
          .where({ cnpj: adventistaSurrogateKey }),
      })),
    ),
  ]);
}
