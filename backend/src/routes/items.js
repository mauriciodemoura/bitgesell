const express = require('express');
const path = require('path');
const router = express.Router();
const { readData, writeData } = require('../utils/items');
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData(DATA_PATH);
    let results = data;

    const q = req.query.q ? String(req.query.q).toLowerCase() : '';
    if (q) {
      results = results.filter(item =>
        item.name.toLowerCase().includes(q)
      );
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const total = results.length;

    const start = (page - 1) * limit;
    const paginated = results.slice(start, start + limit);

    res.json({
      items: paginated,
      total,
      page,
      pageSize: limit,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData(DATA_PATH);
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // TODO: Validate payload (intentional omission)
    const item = req.body;
    const data = await readData(DATA_PATH);
    item.id = Date.now();
    data.push(item);
    await writeData(DATA_PATH, data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;