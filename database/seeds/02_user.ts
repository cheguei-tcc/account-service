import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

const cefsaSurrogateKey = '59.107.300/0001-17';
const marquesSurrogateKey = '54.199.070/0001-40';

const monitorPass = bcrypt.hashSync('monitor', 7);
const adminPass = bcrypt.hashSync('admin', 7);
const rootUserPass = bcrypt.hashSync(process.env.ROOT_USER_PASS || 'super', 7);

const users = [
  {
    name: 'Geraldo',
    cpf: '252.902.417-01',
    password: rootUserPass,
    role: 'super',
    email: 'user@super.com'
  },
  {
    name: 'Renato',
    cpf: '103.011.320-38',
    password: adminPass,
    role: 'admin',
    schoolCnpj: marquesSurrogateKey,
    email: 'admin@novagente.com'
  },
  {
    name: 'Guilhermina',
    cpf: '495.820.892-53',
    password: monitorPass,
    role: 'monitor',
    schoolCnpj: marquesSurrogateKey,
    email: 'monitor@novagente.com'
  },
  {
    name: 'Alamino',
    cpf: '786.921.150-88',
    password: monitorPass,
    role: 'monitor',
    schoolCnpj: cefsaSurrogateKey,
    email: 'monitor-mino@adventista.com'
  },
  {
    name: 'Jaque',
    cpf: '235.825.030-97',
    password: monitorPass,
    role: 'monitor',
    schoolCnpj: cefsaSurrogateKey,
    email: 'monitor-jaque@adventista.com'
  },
];

export async function seed(knex: Knex): Promise<any> {
  // super admin n monitors seed
  for (const user of users) {
    const { role, schoolCnpj, ...userData } = user;

    const [userId] = await knex('user')
      .insert({
        ...userData,
        ...(schoolCnpj && {
          school_id: knex('school').select('id').where({ cnpj: schoolCnpj }),
        }),
      })
      .returning('id')
      .onConflict()
      .ignore();

    if (userId) {
      await knex('user_role').insert({
        user_id: userId,
        role_id: knex('role')
          .select('id')
          .where({ name: role })
          .onConflict()
          .ignore(),
      });
    }
  }
}
