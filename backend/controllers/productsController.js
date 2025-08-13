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

// Export CSV
exports.exportProducts = async (req, res) => {
  const products = await Product.find();
  const headers = 'name,unit,category,brand,stock,status,image\n';
  const csvData = products.map(p =>
    `${p.name},${p.unit},${p.category},${p.brand},${p.stock},${p.status},${p.image}`
  ).join('\n');

  res.header('Content-Type', 'text/csv');
  res.attachment('products.csv');
  res.send(headers + csvData);
};

