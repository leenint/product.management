const supertest = require('supertest');
const app = require('../app');

describe('Product API', () => {
  it('Testing to see if Jest works', () => {
    expect(1).toBe(1);
  });

  test('GET /api/product', async () => {
    const response = await supertest(app).get('/api/product').expect(200);

    expect(typeof response.body.data === 'object').toBeTruthy();
    expect(Array.isArray(response.body.data.items)).toBeTruthy();
  });

  test('CRUD /api/product', async () => {
    // get all current branch
    let response = await supertest(app).get('/api/branch').expect(200);

    expect(typeof response.body.data === 'object').toBeTruthy();
    expect(Array.isArray(response.body.data.items)).toBeTruthy();
    expect(!!response.body.data.items[0]).toBeTruthy();

    const [branch] = response.body.data.items;

    // create new test product
    const testName = new Date().getTime().toString(32);
    const testProduct = {
      colors: ['Red', 'Blue'],
      name: testName,
      code: testName,
      description: '',
      branchId: branch.id,
    };
    response = await supertest(app).post('/api/product')
      .send(testProduct)
      .expect(200);

    expect(typeof response.body.data === 'object').toBeTruthy();
    expect(!!typeof response.body.data.id).toBeTruthy();
    expect(response.body.data.name).toBe(testName);

    const testProductId = response.body.data.id;

    // get detail of product by id
    response = await supertest(app).get(`/api/product/${testProductId}`).expect(200);

    expect(typeof response.body.data === 'object').toBeTruthy();
    expect(response.body.data.name).toBe(testName);

    // update product info
    const updateName = new Date().getTime().toString(20);
    const updateProduct = {
      colors: ['Red', 'Blue'],
      name: updateName,
      code: updateName,
      description: '',
      branchId: branch.id,
    };

    await supertest(app).put(`/api/product/${testProductId}`)
      .send(updateProduct)
      .expect(200);

    response = await supertest(app).get(`/api/product/${testProductId}`).expect(200);
    expect(typeof response.body.data === 'object').toBeTruthy();
    expect(response.body.data.name).toBe(updateName);

    // search by code
    response = await supertest(app).get('/api/product')
      .query({ code: updateName })
      .expect(200);

    expect(typeof response.body.data === 'object').toBeTruthy();
    expect(Array.isArray(response.body.data.items)).toBeTruthy();
    expect(response.body.data.total).toBe(1);
    expect(response.body.data.items.length).toBe(1);

    // delete by id
    await supertest(app).delete(`/api/product/${testProductId}`).expect(200);
  });
});
