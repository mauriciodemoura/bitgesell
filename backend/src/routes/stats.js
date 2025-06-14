const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const { calculateStats, getFileStats } = require('../utils/stats');
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Cache to store computed statistics
let statsCache = {
  data: null,
  lastModified: null,
  calculating: false
};

// Function to read and compute statistics
async function refreshStats() {
  if (statsCache.calculating) {
    // If already computing, wait a bit and return the current cache
    return statsCache.data;
  }

  try {
    statsCache.calculating = true;
    
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    const items = JSON.parse(raw);
    const fileModified = await getFileStats(DATA_PATH);    
    const stats = calculateStats(items);
    
    // Update the cache
    statsCache.data = stats;
    statsCache.lastModified = fileModified;
    
    return stats;
  } finally {
    statsCache.calculating = false;
  }
}

// Function to check if the cache is still valid
async function isCacheValid() {
  if (!statsCache.data || !statsCache.lastModified) {
    return false;
  }

  try {
    const currentFileModified = await getFileStats(DATA_PATH);
    return currentFileModified && 
           statsCache.lastModified && 
           currentFileModified.getTime() === statsCache.lastModified.getTime();
  } catch (err) {
    return false;
  }
}

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    // Check if the cache is still valid
    const cacheValid = await isCacheValid();
    
    let stats;
    if (cacheValid) {
      stats = statsCache.data;
    } else {
      stats = await refreshStats();
    }

    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;