import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/db/mongoose.js';
import { ListSettingsModel } from '../src/models/ListSettings.js';

describe('List API', () => {
  const testDbUri = process.env.TEST_MONGODB_URI ?? 'mongodb://localhost:27017/shopping_test';

  beforeAll(async () => {
    await connectDB(testDbUri);
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await ListSettingsModel.deleteMany({});
  });

  it('GET /list returns settings', async () => {
    const response = await request(app).get('/list');

    expect(response.status).toBe(200);
    expect(response.body.title).toBeDefined();
  });

  it('PUT /list updates title', async () => {
    const response = await request(app).put('/list').send({ title: 'Meine Liste' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Meine Liste');
  });
});
