const Product = require('../models/Product');
const InventoryHistory = require('../models/InventoryHistory');
const fs = require('fs');
const csv = require('csv-parser');

// Get all unique categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories.filter(category => category));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Products with pagination and sorting
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sortField || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const { name, category } = req.query;
    
    let query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (category) query.category = category;

    const total = await Product.countDocuments(query);
    
    const products = await Product.find(query)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Import CSV (Vercel/serverless compatible)
const { Readable } = require('stream');
exports.importProducts = async (req, res) => {
  const results = [];
  const duplicates = [];

  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const stream = Readable.from(req.file.buffer);

  stream
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

  // If stock value is being updated, set status accordingly
  if (req.body.stock !== undefined) {
    req.body.status = req.body.stock > 0 ? 'In_Stock' : 'Out_Of_Stock';

    // Track stock change history
    if (req.body.stock !== product.stock) {
      await InventoryHistory.create({
        productId: product._id,
        oldQuantity: product.stock,
        newQuantity: req.body.stock,
        updatedBy: req.body.updatedBy || 'system'
      });
    }
  }

  Object.assign(product, req.body);
  await product.save();
  res.json(product);
};




