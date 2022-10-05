import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

const cefsaSurrogateKey = '59.107.300/0001-17';
const marquesSurrogateKey = '54.199.070/0001-40';

const filhoPass = bcrypt.hashSync('filho', 7);
const paiPass = bcrypt.hashSync('pai', 7);

const parentsData = [
  // cefsa parents
  {
    name: 'Matias Quemedo',
    cpf: '730.684.000-23',
    email: "matiasquemedo@hotmail.com",
    password: paiPass,
    phone_number: '953884989',
    schoolCnpj: cefsaSurrogateKey,
    children: [
      {
        name: 'João Filho',
        password: filhoPass,
        classroomName: 'Turma 1',
        period: 'Matutino',
      },
    ],
  },
  {
    name: 'Higor Reculiano',
    cpf: '023.286.220-62',
    email: "reculianinho@hotmail.com",
    password: paiPass,    
    phone_number: '123456',
    schoolCnpj: cefsaSurrogateKey,
    children: [
      {
        name: 'Avril',
        password: filhoPass,
        classroomName: 'Turma 1',
        period: 'Matutino',
      },
      {
        name: 'Lavinha',
        cpf: '322.301.100-55',
        password: filhoPass,
        classroomName: 'Turma 2',
        period: 'Matutino',
      },
    ],
  },
  {
    name: 'Junior Colombino',
    cpf: '108.734.250-30',      
    phone_number: '123456',
    email: "jrcolombino@hotmail.com",
    password: paiPass,
    schoolCnpj: cefsaSurrogateKey,
    children: [
      {
        name: 'Jasmino Santos',
        password: filhoPass,
        classroomName: 'Turma 3',
        period: 'Matutino',
      },
    ],
  },
  {
    name: 'Galvão Bueno',
    cpf: '841.878.980-85',
    password: paiPass,
    phone_number: '123456',
    email: "galvaobueno@hotmail.com",
    schoolCnpj: cefsaSurrogateKey,
    children: [
      {
        name: 'Filho do Galvão',
        cpf: '629.874.850-42',
        password: filhoPass,
        classroomName: 'Turma 1',
        period: 'Matutino',
      },
    ],
  },
  {
    name: 'Roberto Neto',
    cpf: '188.131.120-17',
    password: paiPass,
    phone_number: '123456',
    email: "robertoneto@hotmail.com",
    schoolCnpj: cefsaSurrogateKey,
    children: [
      {
        name: 'Roberto Filho',
        password: filhoPass,
        classroomName: 'Turma 3',
        period: 'Matutino',
      },
      {
        name: 'Roberta Sauro',
        cpf: '215.312.960-50',
        password: filhoPass,
        classroomName: 'Turma 2',
        period: 'Matutino',
      },
    ],
  },
  {
    name: 'Maria do Carmo',
    cpf: '629.467.050-05',
    password: paiPass,
    phone_number: '123456',
    email: "mariadocarmo@hotmail.com",
    schoolCnpj: cefsaSurrogateKey,
    children: [
      {
        name: 'Estevan',
        password: filhoPass,
        classroomName: 'Turma 1',
        period: 'Matutino',
      },
    ],
  },
  {
    name: 'Fatima do Rio',
    cpf: '879.128.090-74',      
    phone_number: '123456',
    email: "fatimadorio@hotmail.com",
    password: paiPass,
    schoolCnpj: cefsaSurrogateKey,
    children: [
      {
        name: 'Fresno',
        cpf: '110.939.880-88',
        password: filhoPass,
        classroomName: 'Turma 3',
        period: 'Matutino',
      },
    ],
  },
  // marques parents
  {
    name: 'Marcelo Mattos',
    password: paiPass,
    schoolCnpj: marquesSurrogateKey,
    email: "marcelomatos@hotmail.com",
    children: [
      {
        name: 'Ramiro',
        cpf: '818.224.940-60',
        password: filhoPass,
        classroomName: 'Turma 1A',
        period: 'Matutino',
      },
    ],
  },
  {
    name: 'Gadu Betania',
    cpf: '201.217.860-05',
    email: "betaniagadu@hotmail.com",
    password: paiPass,
    schoolCnpj: marquesSurrogateKey,
    children: [
      {
        name: 'Betoven',
        cpf: '200.205.520-33',
        password: filhoPass,
        classroomName: 'Turma 1A',
        period: 'Matutino',
      },
    ],
  },
  {
    name: 'Pedro Alvares',
    cpf: '325.463.000-91',
    password: paiPass,
    email: "pedroalvares@hotmail.com",
    schoolCnpj: marquesSurrogateKey,
    children: [
      {
        name: 'Jasmine Do Norte',
        cpf: '213.710.640-08',
        password: filhoPass,
        classroomName: 'Turma 1B',
        period: 'Matutino',
      },
    ],
  },
  {
    name: 'Julio da Gaita',
    cpf: '226.080.980-45',    
    email: "gaitajl@hotmail.com",
    password: paiPass,
    schoolCnpj: marquesSurrogateKey,
    children: [
      {
        name: 'Dourado',
        cpf: '424.227.780-62',
        password: filhoPass,
        classroomName: 'Turma 1B',
        period: 'Matutino',
      },
    ],
  },
  {
    name: 'Neo',
    cpf: '566.228.460-14',
    email: "matrixrn@hotmail.com",
    password: paiPass,
    schoolCnpj: marquesSurrogateKey,
    children: [
      {
        name: 'Diana',
        cpf: '181.884.807-46',
        password: filhoPass,
        classroomName: 'Turma 2A',
        period: 'Matutino',
      },
    ],
  },
  {
    name: 'Ana Maria Padrão',
    cpf: '851.163.470-36',
    email: "mariapattern@hotmail.com",
    password: paiPass,
    schoolCnpj: marquesSurrogateKey,
    children: [
      {
        name: 'Louro josé',
        cpf: '694.237.320-62',
        password: filhoPass,
        classroomName: 'Turma 2A',
        period: 'Matutino',
      },
    ],
  },
  {
    name: 'Junior Filho',
    cpf: '556.508.950-66',
    password: paiPass,    
    email: "juniorfilhomaspai@hotmail.com",
    schoolCnpj: marquesSurrogateKey,
    children: [
      {
        name: 'Rubinho Filho',
        cpf: '762.410.910-77',
        password: filhoPass,
        classroomName: 'Turma 2C',
        period: 'Matutino',
      },
    ],
  },
];

export async function seed(knex: Knex): Promise<any> {
  // Upsert seed entries
  for (const parent of parentsData) {
    const { children, schoolCnpj, ...parentData } = parent;
    const [parentId] = await knex('user')
      .insert({
        ...parentData,
        school_id: knex('school').select('id').where({ cnpj: schoolCnpj }),
      })
      .returning('id')
      .onConflict()
      .ignore();

    if (!parentId) continue;

    await knex('user_role')
      .insert({
        user_id: parentId,
        role_id: knex('role').select('id').where({ name: 'parent' }),
      })
      .onConflict()
      .ignore();

    for (const child of children) {
      const { classroomName, period, ...childData } = child;

      const school_id = knex('school').select('id').where({ cnpj: schoolCnpj });

      const [childId] = await knex('user')
        .insert({
          ...childData,
          parent_id: parentId,
          school_id,
        })
        .returning('id')
        .onConflict()
        .ignore();

      if (childId) {
        await knex('user_role')
          .insert({
            user_id: childId,
            role_id: knex('role').select('id').where({ name: 'student' }),
          })
          .onConflict()
          .ignore();

        await knex('student_classroom')
          .insert({
            user_id: childId,
            classroom_id: knex('classroom').select('id').where({
              school_id,
              name: classroomName,
              period,
            }),
          })
          .onConflict()
          .ignore();
      }
    }
  }
}
