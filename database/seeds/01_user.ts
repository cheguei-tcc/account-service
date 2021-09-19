import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<any> {
  const rootUserPass = process.env.ROOT_USER_PASS;

  if (rootUserPass) {
    const hash = await bcrypt.hash(rootUserPass, 7);

    await knex('user')
      .insert({
        name: 'Geraldo',
        cpf: '123456789',
        password: hash,
      })
      .onConflict()
      .ignore();

    await knex('user_role')
      .insert({
        user_id: knex('user')
          .select('id')
          .where({ name: 'Geraldo', cpf: '123456789' }),
        role_id: knex('role').select('id').where({ name: 'super' }),
      })
      .onConflict()
      .ignore();
  }
}
