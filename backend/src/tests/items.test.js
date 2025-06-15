const request = require('supertest');
const app = require('../app');
const { readData, writeData } = require('../utils/items');

jest.mock('../utils/items', () => ({
  readData: jest.fn(),
  writeData: jest.fn(),
}));

describe('Items Routes', () => {
  const mockItems = [
    { id: 1, name: 'Test Item 1', price: 10 },
    { id: 2, name: 'Test Item 2', price: 20 }
  ];

  beforeEach(() => {
    readData.mockResolvedValue(mockItems);
    writeData.mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/items - retorna itens paginados', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toEqual(mockItems);
    expect(res.body.total).toBe(2);
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(10);
  });

  test('GET /api/items com limite - retorna itens limitados', async () => {
    const res = await request(app).get('/api/items?limit=1');
    expect(res.statusCode).toBe(200);
    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0]).toEqual(mockItems[0]);
    expect(res.body.total).toBe(2);
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(1);
  });

  test('GET /api/items com query - retorna itens filtrados', async () => {
    const res = await request(app).get('/api/items?q=item 2');
    expect(res.statusCode).toBe(200);
    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0]).toEqual(mockItems[1]);
    expect(res.body.total).toBe(1);
  });

  test('GET /api/items/:id - retorna item específico', async () => {
    const res = await request(app).get('/api/items/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockItems[0]);
  });

  test('GET /api/items/:id - item não encontrado (404)', async () => {
    readData.mockResolvedValueOnce(mockItems);
    const res = await request(app).get('/api/items/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toEqual('Item not found');
  });

  test('POST /api/items - cria novo item', async () => {
    const newItem = { name: 'New Item', price: 30 };
    readData.mockResolvedValueOnce(mockItems);
    const res = await request(app)
      .post('/api/items')
      .send(newItem)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newItem.name);
    expect(res.body.price).toBe(newItem.price);
    expect(res.body).toHaveProperty('id');
    expect(writeData).toHaveBeenCalled();
  });

  test('POST /api/items - tratamento de erro interno (500)', async () => {
    readData.mockRejectedValueOnce(new Error('Erro interno'));

    const newItem = { name: 'Erro Item', price: 40 };
    const res = await request(app)
      .post('/api/items')
      .send(newItem)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(500);
  });
});
