const fs = require('fs').promises;

// Function to calculate statistics
function calculateStats(items) {
  if (!items || items.length === 0) {
    return {
      total: 0,
      averagePrice: 0
    };
  }

  const total = items.length;
  const totalPrice = items.reduce((acc, cur) => acc + (cur.price || 0), 0);
  const averagePrice = total > 0 ? totalPrice / total : 0;

  return {
    total,
    averagePrice: parseFloat(averagePrice.toFixed(2))
  };
}

// Function to get statistics from the file
async function getFileStats(filePath) {
  try {
    const fileStat = await fs.stat(filePath);
    return fileStat.mtime;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}

module.exports = {
  calculateStats,
  getFileStats
};
