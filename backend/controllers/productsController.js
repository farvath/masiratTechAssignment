const Product = require('../models/Product');
const InventoryHistory = require('../models/InventoryHistory');
const fs = require('fs');
const csv = require('csv-parser');

// Import CSV
exports.importProducts = async (req, res) => {
  const results = [];
  const duplicates = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      let addedCount = 0;

      for (let row of results) {
        const exists = await Product.findOne({ name: row.name });
        if (exists) {
          duplicates.push(row);
        } else {
          await Product.create(row);
          addedCount++;
        }
      }

      res.json({ added: addedCount, skipped: duplicates.length, duplicates });
    });
};

