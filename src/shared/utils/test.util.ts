import { HttpStatus, INestApplication } from '@nestjs/common';
import { AUTH_HEADER } from 'src/modules/auth/constants/strategy.constant';
import supertest from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import {
  APP_API_KEY,
  TEST_DATABASE_HOST,
  TEST_DATABASE_NAME,
  TEST_DATABASE_PORT,
} from '../config/env';

const TEST_DB_CONNECTION_NAME = 'e2e_test_connection';
export const TEST_DB_NAME = 'e2e_test_db';

export const initTestDb = async (): Promise<void> => {
  // This overwrites the DB_NAME used in the SharedModule's TypeORM init.
  // All the tests will run against the e2e db due to this overwrite.
  process.env.DB_NAME = TEST_DATABASE_NAME;
  process.env.DB_PORT = TEST_DATABASE_PORT;
  process.env.DB_HOST = TEST_DATABASE_HOST;

  console.log(`Dropping ${TEST_DATABASE_NAME} database and recreating it`);

  const connection = await createConnection({
    name: TEST_DB_CONNECTION_NAME,
    type: 'mysql',
    host: process.env.DB_HOST_TEST,
    port: parseInt(TEST_DATABASE_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  await connection.query(`drop database if exists ${TEST_DATABASE_NAME}`);
  await connection.query(`create database ${TEST_DATABASE_NAME}`);

  await connection.close();
};

export const createTestDbEntities = async (): Promise<void> => {
  console.log(`Creating entities in ${TEST_DATABASE_NAME} database`);
  await createConnection({
    name: TEST_DB_CONNECTION_NAME,
    type: 'mysql',
    host: process.env.DB_HOST_TEST,
    port: parseInt(TEST_DATABASE_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: TEST_DATABASE_NAME,
    entities: [__dirname + '/../src/modules/**/*.entity{.ts,.js}'],
    synchronize: true,
  });
};

export const requestUtil = (app: INestApplication) =>
  async function myRequest(
    url: string,
    {
      expectedStatus = HttpStatus.OK,
      method = 'get',
      body,
      contentType = 'application/json',
      accept = 'application/json',
      query,
      accessToken = 'mock-token',
      responseType,
    }: {
      expectedStatus?: HttpStatus;
      method?: 'get' | 'post' | 'put' | 'delete';
      body?: any;
      contentType?: string;
      accept?: string;
      query?: Record<string, any>;
      accessToken?: string;
      responseType?: string;
    } = {},
  ): Promise<any> {
    const agent = supertest.agent(app.getHttpServer());
    const req = agent[method](url)
      .set('Accept', accept)
      .set(AUTH_HEADER.API_KEY, APP_API_KEY)
      .set('Authorization', `Bearer ${accessToken}`);

    responseType && req.responseType(responseType);
    query && req.query(query);

    const reqAfterSend = body
      ? req.set('Content-Type', contentType).send(body)
      : req;

    return reqAfterSend.expect(expectedStatus).then((res) => {
      try {
        return JSON.parse(res.text);
      } catch (error) {
        return res.text;
      }
    });
  };

export const closeTestDbConnection = async (): Promise<void> => {
  console.log(`Closing connection to ${TEST_DB_NAME} database`);
  const connection = getConnection(TEST_DB_CONNECTION_NAME);
  await connection.close();
};
