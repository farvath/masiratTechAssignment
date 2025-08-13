
require('dotenv').config();
const corsMiddleware = require('./middleware/corsMiddleware');

const express = require('express');
const mongoose = require('mongoose');


const productRoutes = require('./routes/products');
const connectDB = require('./config/db');


connectDB();


const app = express();
app.use(corsMiddleware);
app.use(express.json());
app.use('/api/products', productRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
