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


// Get Products (with filters)
exports.getProducts = async (req, res) => {
  const { name, category } = req.query;
  let query = {};
  if (name) query.name = { $regex: name, $options: 'i' };
  if (category) query.category = category;

  const products = await Product.find(query);
  res.json(products);
};


// Get Inventory History
exports.getProductHistory = async (req, res) => {
  const history = await InventoryHistory.find({ productId: req.params.id })
    .sort({ date: -1 });
  res.json(history);
};

// Update Product + Track Changes
exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send('Not found');

  if (req.body.stock !== undefined && req.body.stock !== product.stock) {
    await InventoryHistory.create({
      productId: product._id,
      oldQuantity: product.stock,
      newQuantity: req.body.stock,
      updatedBy: req.body.updatedBy || 'system'
    });
  }

  Object.assign(product, req.body);
  await product.save();
  res.json(product);
};



