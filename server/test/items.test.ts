import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/db/mongoose.js';
import { ShoppingItemModel } from '../src/models/ShoppingItem.js';
import { ListSettingsModel } from '../src/models/ListSettings.js';

describe('Items API', () => {
  const testDbUri = process.env.TEST_MONGODB_URI ?? 'mongodb://localhost:27017/shopping_test';

  beforeAll(async () => {
    await connectDB(testDbUri);
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await ShoppingItemModel.deleteMany({});
    await ListSettingsModel.deleteMany({});
  });

  it('POST /items creates an item', async () => {
    const response = await request(app).post('/items').send({ name: 'Butter' });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Butter');
    expect(response.body.bought).toBe(false);
    expect(response.body.quantity).toBe(1);
    expect(response.body.order).toBeDefined();
    expect(typeof response.body.createdAt).toBe('string');
  });

  it('GET /items returns the list', async () => {
    await request(app).post('/items').send({ name: 'Milk' });

    const response = await request(app).get('/items');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Milk');
    expect(response.body[0].quantity).toBe(1);
    expect(response.body[0].order).toBeDefined();
  });

  it('PUT /items/:id updates bought', async () => {
    const created = await request(app).post('/items').send({ name: 'Bread' });

    const response = await request(app).put(`/items/${created.body.id}`).send({ bought: true });

    expect(response.status).toBe(200);
    expect(response.body.bought).toBe(true);
  });

  it('POST /items increases quantity for duplicate name', async () => {
    await request(app).post('/items').send({ name: 'Apfel' });
    const response = await request(app).post('/items').send({ name: 'Apfel' });

    expect(response.status).toBe(201);
    expect(response.body.quantity).toBe(2);
    expect(response.body.order).toBeDefined();
  });

  it('DELETE /items/:id removes item', async () => {
    const created = await request(app).post('/items').send({ name: 'Eggs' });

    const response = await request(app).delete(`/items/${created.body.id}`);

    expect(response.status).toBe(204);

    const after = await request(app).get('/items');
    expect(after.body).toHaveLength(0);
  });

  it('POST /items validates name', async () => {
    const response = await request(app).post('/items').send({ name: '' });

    expect(response.status).toBe(400);
  });
});
