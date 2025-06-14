const request = require('supertest');
const fs = require('fs').promises;
const app = require('../app');

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}));

describe('Items Routes', () => {
  const mockItems = [
    { id: 1, name: 'Test Item 1', price: 10 },
    { id: 2, name: 'Test Item 2', price: 20 }
  ];

  beforeEach(() => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockItems));
    fs.writeFile.mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/items - retorna todos os itens', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockItems);
  });

  test('GET /api/items com limite - retorna itens limitados', async () => {
    const res = await request(app).get('/api/items?limit=1');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toEqual(mockItems[0]);
  });

  test('GET /api/items com query - retorna itens filtrados', async () => {
    const res = await request(app).get('/api/items?q=item 2');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toEqual(mockItems[1]);
  });

  test('GET /api/items/:id - retorna item específico', async () => {
    const res = await request(app).get('/api/items/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockItems[0]);
  });

  test('GET /api/items/:id - item não encontrado (404)', async () => {
    const res = await request(app).get('/api/items/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toEqual('Item not found');
  });

  test('POST /api/items - cria novo item', async () => {
    const newItem = { name: 'New Item', price: 30 };
    const res = await request(app)
      .post('/api/items')
      .send(newItem)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newItem.name);
    expect(res.body.price).toBe(newItem.price);
    expect(res.body).toHaveProperty('id');
    expect(fs.writeFile).toHaveBeenCalled();
  });

  test('POST /api/items - tratamento de erro interno (500)', async () => {
    fs.readFile.mockRejectedValueOnce(new Error('Erro interno'));

    const newItem = { name: 'Erro Item', price: 40 };
    const res = await request(app)
      .post('/api/items')
      .send(newItem)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(500);
  });
});
