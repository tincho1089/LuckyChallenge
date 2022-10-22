import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { useContainer } from 'class-validator';

describe('E2E global tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/register (POST)(SUCCESS)', async () => {
    const mockRequest = {
      username: 'test',
      password: 'test',
      name: 'test',
      address: 'test_street',
      cityId: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(mockRequest);

    expect(response.statusCode).toBe(201);
    expect('Transaction committed successfully');
  });

  it('/auth/register (POST)(ERROR)(Missing username)', async () => {
    const mockRequest = {
      password: 'test2',
      name: 'test2',
      address: 'test_street2',
      cityId: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockRequest);

    const jRsp = JSON.parse(response.text);

    expect(jRsp.statusCode).toBe(400);
    expect(jRsp.message).toStrictEqual(['username should not be empty']);
    expect(jRsp.error).toBe('Bad Request');
    return;
  });

  it('/auth/register (POST)(ERROR)(Missing password)', async () => {
    const mockRequest = {
      username: 'test3',
      name: 'test3',
      address: 'test_street3',
      cityId: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockRequest);

    const jRsp = JSON.parse(response.text);

    expect(jRsp.statusCode).toBe(400);
    expect(jRsp.message).toStrictEqual([
      'password should not be empty',
      'password must be shorter than or equal to 8 characters',
      'password must be longer than or equal to 4 characters',
    ]);
    expect(jRsp.error).toBe('Bad Request');
    return;
  });

  it('/auth/register (POST)(ERROR)(Missing name)', async () => {
    const mockRequest = {
      username: 'test4',
      password: 'test4',
      address: 'test_street4',
      cityId: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockRequest);

    const jRsp = JSON.parse(response.text);

    expect(jRsp.statusCode).toBe(400);
    expect(jRsp.message).toStrictEqual(['name should not be empty']);
    expect(jRsp.error).toBe('Bad Request');
    return;
  });

  it('/auth/register (POST)(ERROR)(Missing address)', async () => {
    const mockRequest = {
      username: 'test5',
      password: 'test5',
      name: 'test5',
      cityId: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockRequest);

    const jRsp = JSON.parse(response.text);

    expect(jRsp.statusCode).toBe(400);
    expect(jRsp.message).toStrictEqual(['address should not be empty']);
    expect(jRsp.error).toBe('Bad Request');
    return;
  });

  it('/auth/register (POST)(ERROR)(Missing cityId)', async () => {
    const mockRequest = {
      username: 'test6',
      password: 'test6',
      name: 'test6',
      address: 'test_street6',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockRequest);

    const jRsp = JSON.parse(response.text);

    expect(jRsp.statusCode).toBe(400);
    expect(jRsp.message).toStrictEqual(['cityId should not be empty']);
    expect(jRsp.error).toBe('Bad Request');
    return;
  });

  it('/auth/register (POST)(ERROR)(Empty username)', async () => {
    const mockRequest = {
      username: '',
      password: 'test7',
      name: 'test7',
      address: 'test_street7',
      cityId: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockRequest);

    const jRsp = JSON.parse(response.text);

    expect(jRsp.statusCode).toBe(400);
    expect(jRsp.message).toStrictEqual(['username should not be empty']);
    expect(jRsp.error).toBe('Bad Request');
    return;
  });

  it('/auth/register (POST)(ERROR)(Empty password)', async () => {
    const mockRequest = {
      username: 'test8',
      password: '',
      name: 'test8',
      address: 'test_street8',
      cityId: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockRequest);

    const jRsp = JSON.parse(response.text);

    expect(jRsp.statusCode).toBe(400);
    expect(jRsp.error).toBe('Bad Request');
    return;
  });

  it('/auth/register (POST)(ERROR)(Empty name)', async () => {
    const mockRequest = {
      username: 'test9',
      password: 'test9',
      name: '',
      address: 'test_street9',
      cityId: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockRequest);

    const jRsp = JSON.parse(response.text);

    expect(jRsp.statusCode).toBe(400);
    expect(jRsp.message).toStrictEqual(['name should not be empty']);
    expect(jRsp.error).toBe('Bad Request');
    return;
  });

  it('/auth/register (POST)(ERROR)(Empty address)', async () => {
    const mockRequest = {
      username: 'test10',
      password: 'test10',
      name: 'test10',
      address: '',
      cityId: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockRequest);

    const jRsp = JSON.parse(response.text);

    expect(jRsp.statusCode).toBe(400);
    expect(jRsp.message).toStrictEqual(['address should not be empty']);
    expect(jRsp.error).toBe('Bad Request');
    return;
  });

  it('/auth/register (POST)(ERROR)(Empty cityId)', async () => {
    const mockRequest = {
      username: 'test11',
      password: 'test11',
      name: 'test11',
      address: 'test_street11',
      cityId: '',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockRequest);

    const jRsp = JSON.parse(response.text);

    expect(jRsp.statusCode).toBe(400);
    expect(jRsp.message).toStrictEqual(['cityId should not be empty']);
    expect(jRsp.error).toBe('Bad Request');
    return;
  });

  it('/auth/login (POST)(SUCCESS)', async () => {
    const mockRequestCreate = {
      username: 'test12',
      password: 'test12',
      name: 'test12',
      address: 'test_street12',
      cityId: 1,
    };

    const responseCreate = await request(app.getHttpServer())
      .post('/auth/register')
      .send(mockRequestCreate);

    expect(responseCreate.statusCode).toBe(201);
    expect('Transaction committed successfully');

    const mockRequestLogin = {
      username: mockRequestCreate.username,
      password: mockRequestCreate.password,
    };

    const responseLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send(mockRequestLogin);

    expect(responseLogin.statusCode).toBe(201);
    expect(responseLogin.body).toHaveProperty('jwtToken');
  });

  it('/user/profile (GET)(SUCCESS)', async () => {
    const mockRequestCreate = {
      username: 'test13',
      password: 'test13',
      name: 'test13',
      address: 'test_street13',
      cityId: 1,
    };

    const responseCreate = await request(app.getHttpServer())
      .post('/auth/register')
      .send(mockRequestCreate);

    expect(responseCreate.statusCode).toBe(201);
    expect('Transaction committed successfully');

    const mockRequestLogin = {
      username: mockRequestCreate.username,
      password: mockRequestCreate.username,
    };

    const responseLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send(mockRequestLogin);

    expect(responseLogin.statusCode).toBe(201);
    expect(responseLogin.body).toHaveProperty('jwtToken');

    const responseGetProfile = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${responseLogin.body.jwtToken}`)
      .send();

    expect(responseGetProfile.statusCode).toBe(200);
    expect(responseGetProfile.body).toHaveProperty(['id']);
  });

});
